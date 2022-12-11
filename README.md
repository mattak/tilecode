# tilecode

## What is tilecode?

Tilecode is incremental binary encoding format for map tile id (zoom/x/y). 
It is represented by simple binary format.

## Examples

Zoom:4 X:12 Y:3

```
X = 12 = 0b1100
Y = 3 = 0b0011

1 1 0 0
 0 0 1 1
10100101

=> Tilecode: 0b10100101 or 0xA5
```

## Why tilecode?

Tilecode is easy to filter places by using incremental code.
If you need to find your near places, get current location of tilecode and search places which has current tilecode prefix.
