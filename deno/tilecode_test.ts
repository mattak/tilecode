import {assertEquals} from "https://deno.land/std@0.65.0/testing/asserts.ts";
import {bufferToBinary, convertLatLngToTileXY, decodeTileZXY, encodeLatLng, encodeTileZXY} from "./tilecode.ts";

Deno.test('bufferToBinary', () => {
  assertEquals(bufferToBinary(new Uint8Array(0)), "0b");
  {
    const v = new Uint8Array(1);
    v[0] = 0b0000_0000;
    assertEquals(bufferToBinary(v), "0b00000000");
  }
  {
    const v = new Uint8Array(1);
    v[0] = 0b0000_1000;
    assertEquals(bufferToBinary(v), "0b00001000");
  }
  {
    const v = new Uint8Array(1);
    v[0] = 0b1010_1011;
    assertEquals(bufferToBinary(v), "0b10101011");
  }
  {
    const v = new Uint8Array(1);
    v[0] = 0b1111_1111;
    assertEquals(bufferToBinary(v), "0b11111111");
  }
  {
    const v = new Uint8Array(2);
    v[0] = 0b1111_1111
    v[1] = 0b0000_1111;
    assertEquals(bufferToBinary(v), "0b1111111100001111");
  }
});

Deno.test('encodeLatLng', () => {
  assertEquals(bufferToBinary(encodeLatLng(0, 0, 0)), "0b");
  // tx:0, ty:0
  assertEquals(bufferToBinary(encodeLatLng(4, 85, -179)), "0b00000000");
  // tx:15, ty:15
  assertEquals(bufferToBinary(encodeLatLng(4, -85, 180)), "0b11111111");
  // tx:7 (0b0111), ty:8 (0b1000)
  assertEquals(bufferToBinary(encodeLatLng(4, 0, 0)), "0b01101010");
  // tx:15 (0b1111), ty:0 (0b0000)
  assertEquals(bufferToBinary(encodeLatLng(4, -85, -179)), "0b01010101");
  // tx:0 (0b0000), ty:15 (0b1111)
  assertEquals(bufferToBinary(encodeLatLng(4, 85, 180)), "0b10101010");
  // tx:255 (0b11111111), ty:255 (0b11111111)
  assertEquals(bufferToBinary(encodeLatLng(8, -85, 180)), "0b1111111111111111");
  // tx:0 (0b00000000), ty:0 (0b00000000)
  assertEquals(bufferToBinary(encodeLatLng(8, 85, -179)), "0b0000000000000000");
});

Deno.test('decodeMapZXY', () => {
  {
    const array = new Uint8Array(1);
    array[0] = 0b0000_0000;
    assertEquals(decodeTileZXY(array), [4, 0, 0]);
  }
  {
    const array = new Uint8Array(1);
    array[0] = 0b1010_1010;
    assertEquals(decodeTileZXY(array), [4, 15, 0]);
  }
  {
    const array = new Uint8Array(1);
    array[0] = 0b1000_0010;
    assertEquals(decodeTileZXY(array), [4, 9, 0]);
  }
  {
    const array = new Uint8Array(1);
    array[0] = 0b0101_0101;
    assertEquals(decodeTileZXY(array), [4, 0, 15]);
  }
  {
    const array = new Uint8Array(1);
    array[0] = 0b1111_1111;
    assertEquals(decodeTileZXY(array), [4, 15, 15]);
  }
  {
    const array = new Uint8Array(2);
    array[0] = 0b10111100;
    array[1] = 0b00011010;
    assertEquals(decodeTileZXY(array), [8, 227, 100]);
  }
});

Deno.test('encodeTile', () => {
  // tx:14 (0b1110), ty:6 (0b0110)
  assertEquals(bufferToBinary(encodeTileZXY(4, 14, 6)), '0b10111100');
  // tx:224 (0b11100000), ty:100 (0b01100100)
  assertEquals(bufferToBinary(encodeTileZXY(8, 224, 100)), '0b1011110000010000');
});


Deno.test('convertLatLngToTileXY', () => {
  assertEquals(
    convertLatLngToTileXY(4, 35.69317870407225, 139.76959812862006),
    [14, 6]
  );
  assertEquals(
    convertLatLngToTileXY(12, 35.69317870407225, 139.76959812862006),
    [3638, 1612]
  );
  assertEquals(
    convertLatLngToTileXY(20, 35.69317870407225, 139.76959812862006),
    [931396, 412863]
  );
  assertEquals(
    convertLatLngToTileXY(4, 0, 0),
    [7, 8]
  );
  assertEquals(
    convertLatLngToTileXY(4, 85, -179),
    [0, 0]
  );
  assertEquals(
    convertLatLngToTileXY(4, -85, 180),
    [15, 15]
  );
  assertEquals(
    convertLatLngToTileXY(8, 35.69317870407225, 139.76959812862006),
    [227, 100]
  );
});