export function bufferToHex(buffer: Uint8Array): string {
  return "0x" + Array.from(buffer).map(b => b.toString(16).padStart(2, '0')).join('');
}

export function bufferToBinary(buffer: Uint8Array): string {
  return "0b" + Array.from(buffer).map(b => (b >>> 0).toString(2).padStart(8, '0')).join('');
}

export function parseTilecode(text: string): Uint8Array {
  if (text.startsWith("0x")) {
    const numbers = text.slice(2).match(/.{1,2}/g)!.map(b => parseInt(b, 16));
    return new Uint8Array(numbers);
  } else if (text.startsWith("0b")) {
    const numbers = text.slice(2).match(/.{1,8}/g)!.map(b => parseInt(b, 2));
    return new Uint8Array(numbers);
  } else if (text.includes("/")) {
    const [z, x, y] = text.split("/", 3).map(s => parseInt(s));
    return encodeTileZXY(z, x, y);
  } else {
    throw new Error("Invalid tilecode. tilecode must be starts with 0x or 0b");
  }
}

export function decodeTileZXY(tilecode: Uint8Array): [number, number, number] {
  let x = 0;
  let y = 0;
  const zoom = tilecode.length * 4;

  for (let i = 0; i < tilecode.length; i++) {
    const v = tilecode[i];

    for (let k = 0; k < 4; k++) {
      const refx = 1 << k * 2 + 1;
      const refy = 1 << k * 2;
      const z = (tilecode.length - 1 - i) * 4 + k;
      if (v & refx) x |= 1 << z;
      if (v & refy) y |= 1 << z;
    }
  }

  return [zoom, x, y];
}

export function encodeTileZXY(zoom: number, tx: number, ty: number): Uint8Array {
  const level = zoom / 4;
  const array = new Uint8Array(level);

  for (let i = 0; i < level; i++) {
    let v = 0;
    for (let k = 0; k < 4; k++) {
      const z = (zoom - 1) - (i * 4) - k;
      const ref = 1 << z;
      if (tx & ref) {
        v |= 1 << (2 * (3 - k) + 1);
      }
      if (ty & ref) {
        v |= 1 << (2 * (3 - k));
      }
    }
    array[i] = v;
  }

  return array;
}

export function encodeLatLng(zoom: number, lat: number, lng: number): Uint8Array {
  if (zoom == 0) return new Uint8Array(0);
  const [tx, ty] = convertLatLngToTileXY(zoom, lat, lng);
  return encodeTileZXY(zoom, tx, ty);
}

export function getTileCenter(zoom: number, x: number, y: number): [number, number] {
  const zoomshift = 1.0 / (1 << zoom);
  const lng = x * 360.0 * zoomshift - 180.0;
  const n = Math.PI - 2.0 * Math.PI * y * zoomshift;
  const lat = 180.0 / Math.PI * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n)));
  return [lat, lng];
}

export function convertLatLngToTileXY(zoom: number, lat: number, lng: number): [number, number] {
  if (zoom <= 0) return [0, 0];

  // y = R log | tan(π/4 + φ/2) |
  // x = R φ
  const tx2 = Math.ceil(
    (lng / 180.0 + 1)
    * (1 << (zoom - 1))
  ) - 1;
  let ty2 = Math.ceil(
    (Math.log(Math.tan((lat + 90.0) * Math.PI / 360.0)) / Math.PI + 1)
    * (1 << (zoom - 1))
  ) - 1;

  // invert y for google tiling style
  ty2 = (1 << zoom) - 1 - ty2;
  return [tx2, ty2];
}
