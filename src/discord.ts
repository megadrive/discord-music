"use strict";

import {
    Client,
    Message,
    Channel,
    TextChannel,
    VoiceChannel,
} from "discord.js";

import { Config } from "./config";
import { Player } from "./player";

export interface ITokenOptions {
    youtube: string;
    discord: string;
}

export interface IChannelsOptions {
    textChannelId: string;
    voiceChannelId: string;
}

export class DiscordMusic {
    client: Client;
    textChannel: TextChannel;
    voiceChannel: VoiceChannel;

    player: Player;
    config: Config = new Config();
    tokens: any;

    constructor(tokens: ITokenOptions, channels: IChannelsOptions) {
        this.config = new Config();

        this.player = new Player({
            config: this.config,
            prefix: "!",
        });

        this.client = new Client();
        this.client.login(tokens.discord);
        this.client.on("ready", () => {
            this._getDiscordChannels();
        });
    }

    _getDiscordChannels() {
        console.warn("Get Discord channels: textChannel/voiceChannel");
    }

    nowPlaying() {
        const np = this.player.nowPlaying();
        this.textChannel ? this.textChannel.send(np) : console.log(np);
    }

    handleMessage(message: Message) {
        const prefix = this.config.prefix ? this.config.prefix : "!";
        if (message.cleanContent.startsWith(prefix + "sr")) {
            const [method, ...args] = message.cleanContent.split(" ").slice(1);

            switch (method) {
                case "sr":
                    this.player.addToQueue(args[0]);
                    break;
                case "np":
                case "nowplaying":
                    this.player.nowPlaying();
                    break;
            }
        }
    }
}
