"use strict";

import { Config } from "./config";
import { Player } from "./player";
import { readFileSync } from "fs";
import { DiscordMusic } from "./discord";

const config = new Config();
config.importFromEnv();

const token = readFileSync("./token", "utf8");
if (!token) {
    console.error("need a token");
    process.exit(1);
}
const tokensArray = JSON.parse('["' + token.split(",").join('","') + '"]');

console.log(tokensArray);

const tokens = {
    youtube: tokensArray[0],
    discord: tokensArray[1],
};

const music: DiscordMusic = new DiscordMusic(tokens);
