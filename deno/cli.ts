import {Command} from "https://deno.land/x/cliffy@v0.25.7/mod.ts";
import {VERSION} from "./version.ts";
import {executeEncode} from "./command_encode.ts";

export async function runCommand() {
  await new Command()
    .name("tilecode")
    .version(VERSION)
    .description("Encode map tile id to hex code, binary code.")
    // // encode
    // .command("encode", "Encode tile_id / hex_code / binary_code / zoom,lat,lng")
    .usage(
      "18/232831/103246\ntilecode 0xbc1a73afe\ntilecode 0b101111000001101001110011101011111110\ntilecode 18,35.658789693553345,139.7454489910092\n",
    )
    .option("--hex", "print only hex code. format: `0x<hex>*`")
    .option("--binary", "print only binary code. format: `0b<binary>*`")
    .option("--tile-id", "print only tile id. format: `<zoom>/<x>/<y>`")
    .option(
      "--location-center",
      "print only center location of tile. format: `<lat>,<lng>`",
    )
    .option(
      "--location-start",
      "print only start location of tile. format: `<lat>,<lng>`",
    )
    .option("--format-json", "print as json format")
    .option("--format-tsv", "print as tsv format")
    .arguments(
      "<tileId_or_hex_or_binary_or_zoom_lat_lng:string> [lat:double] [lng:double]",
    )
    .action((options, ...args) => {
      executeEncode(options, args[0]);
    })
    .parse(Deno.args);
}