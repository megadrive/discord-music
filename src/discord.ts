"use strict";

import {
    Client,
    Message,
    Channel,
    TextChannel,
    VoiceChannel,
    VoiceConnection,
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
    textChannel: TextChannel | null = null;
    voiceChannel: VoiceChannel | null = null;

    voiceConnection: VoiceConnection | null = null;

    player: Player;
    config: Config;
    tokens: any;

    constructor(
        tokens: ITokenOptions,
        channels: IChannelsOptions,
        config: Config
    ) {
        this.config = config;

        this.player = new Player({
            config: this.config,
        });

        this.client = new Client();
        this.client.login(tokens.discord);
        this.client.on("ready", () => {
            this._getDiscordChannels(channels);
        });
        this.client.on("message", message => this.handleMessage(message));
    }

    async joinVoice(voiceChannel: VoiceChannel) {
        try {
            if (!this.voiceChannel || !voiceChannel)
                throw Error("voice channels not supplied");
            // Only try to join the sender's voice channel if they are in one themselves
            if (voiceChannel.id === this.voiceChannel.id) {
                this.voiceConnection = await voiceChannel.join();
                return true;
            } else {
                throw Error("User not in a channel.");
            }
        } catch (err) {
            console.error(err);
        }
    }

    leaveVoice() {
        if (this.voiceChannel) {
            this.voiceChannel.leave();
            this.voiceChannel = null;
        }
    }

    _getDiscordChannels(channels: IChannelsOptions) {
        console.warn("Get Discord channels: textChannel/voiceChannel");

        this.textChannel = <TextChannel>(
            this.client.channels.get(channels.textChannelId)
        );
        this.voiceChannel = <VoiceChannel>(
            this.client.channels.get(channels.voiceChannelId)
        );
    }

    nowPlaying() {
        const np = this.player.nowPlaying();
        this.textChannel ? this.textChannel.send(np) : console.log(np);
    }

    handleMessage(message: Message) {
        console.log(this.config);
        if (message.cleanContent.startsWith(this.config.prefix)) {
            const [method, ...args] = message.cleanContent
                .substring(1)
                .split(" ");

            switch (method) {
                case "join":
                    this.joinVoice(message.member.voiceChannel);
                    break;
                case "leave":
                    this.leaveVoice();
                    break;
                case "sr":
                case "songrequest":
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
