"use strict";

import { Config } from "./config";
import { Player } from "./player";
import { readFileSync } from "fs";
import { DiscordMusic, IChannelsOptions, ITokenOptions } from "./discord";

const config = new Config();
config.importFromEnv();

(async () => {
    const env: any = await config.get([
        "YOUTUBE_API_KEY",
        "DISCORD_TOKEN",
        "TEXT_CHANNEL",
        "VOICE_CHANNEL",
    ]);
    const tokens: ITokenOptions = {
        youtube: env.YOUTUBE_API_KEY,
        discord: env.DISCORD_TOKEN,
    };
    const channels: IChannelsOptions = {
        textChannelId: env.TEXT_CHANNEL,
        voiceChannelId: env.VOICE_CHANNEL,
    };

    const music: DiscordMusic = new DiscordMusic(tokens, channels, config);
})();
