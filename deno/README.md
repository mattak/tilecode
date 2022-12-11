# tilecode deno runner

usage:

```shell
$ deno run main.ts <zoom> <lat> <lng>
$ deno run main.ts <zoom/x/y>
$ deno run main.ts <binarycode>
$ deno run main.ts <hexcode>
```

example:

```shell
$ deno run main.ts 0xbc
$ deno run main.ts 0b10111100
$ deno run main.ts 4/14/6
$ deno run main.ts 4 31.95216223802496 146.25
HexCode:	0xbc
BinaryCode:	0b10111100 
TileId:	4/14/6
TileCenter:	31.95216223802496,146.25
```
