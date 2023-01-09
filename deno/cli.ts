import {Command} from "https://deno.land/x/cliffy@v0.25.7/mod.ts";
import {VERSION} from "./version.ts";
import {executeEncode} from "./command_encode.ts";

await new Command()
  .name("tilecode")
  .version(VERSION)
  .description("Encode map tile id to hex code, binary code.")
  // // encode
  // .command("encode", "Encode tile_id / hex_code / binary_code / zoom,lat,lng")
  .usage(
    "10/128/11\ntilecode 0xa012\ntilecode 0b0011\ntilecode 12,35.123,136.789\n",
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
