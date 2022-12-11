#!/usr/bin/env deno run
import {
  bufferToBinary,
  bufferToHex,
  convertLatLngToTileXY,
  decodeTileZXY,
  encodeTileZXY,
  getTileCenter,
  parseTilecode
} from "./tilecode.ts";

function checkEncodeArgument(zoom: number, lat: number, lng: number) {
  const LAT_LIMIT = 85.05112877980659;
  const LNG_LIMIT = 180.0;
  if (lat < -LAT_LIMIT || lat > LAT_LIMIT) throw new Error("lat out of range:" + lat);
  if (lng < -LNG_LIMIT || lng > LNG_LIMIT) throw new Error("lng out of range:" + lng);
  if (zoom < 0) throw new Error("zoom out of range");
  if (zoom % 4 !== 0) throw new Error("zoom must be multiple of 4");
}

function main() {
  if (Deno.args.length < 1) {
    const cmd = "deno run main.ts";
    console.log(`Please provide lat,lng
Usage: 
  ${cmd} tilecode
  ${cmd} zoom lat lng

Example:
  ${cmd} 0b1011110000011010
  ${cmd} 0xbc1a
  ${cmd} 4/14/6
  ${cmd} 2 35.5074 136.1278
`);
    Deno.exit(1);
  }

  if (Deno.args.length == 3) {
    const zoom = parseFloat(Deno.args[0]);
    const lat = parseFloat(Deno.args[1]);
    const lng = parseFloat(Deno.args[2]);
    checkEncodeArgument(zoom, lat, lng);

    const [x, y] = convertLatLngToTileXY(zoom, lat, lng);
    const code = encodeTileZXY(zoom, x, y);
    const [clat, clng] = getTileCenter(zoom, x + 0.5, y + 0.5);
    console.log(`HexCode:\t${bufferToHex(code)}`);
    console.log(`BinaryCode:\t${bufferToBinary(code)}`);
    console.log(`TileId:\t${zoom}/${x}/${y}`);
    console.log(`TileCenter:\t${clat},${clng}`);
    return;
  }

  if (Deno.args.length == 1) {
    const text = Deno.args[0];
    const code = parseTilecode(text);
    const [zoom, x, y] = decodeTileZXY(code);
    const [lat, lng] = getTileCenter(zoom, x + 0.5, y + 0.5);
    console.log(`HexCode:\t${bufferToHex(code)}`);
    console.log(`BinaryCode:\t${bufferToBinary(code)}`);
    console.log(`TileId:\t${zoom}/${x}/${y}`);
    console.log(`TileCenter:\t${lat},${lng}`);
    return;
  }
}

main();
