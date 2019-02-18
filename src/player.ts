"use strict";

import { Config } from "./config";
import { Queue } from "./queue";
import { Song } from "./song";
import { EventEmitter } from "events";

const YouTube = require("simple-youtube-api");

interface IPlayerOptions {
    config: Config;
}

export class Player extends EventEmitter {
    config: Config;
    queue: Queue = new Queue();
    api: any;
    options: IPlayerOptions;

    constructor(options: IPlayerOptions) {
        super();

        this.options = options;
        this.config = options.config;

        this.config.props
            .get("YOUTUBE_TOKEN_API")
            .then(key => {
                this.api = new YouTube(key);
                this.queue.setYoutube(this.api);

                this.emit("ready", []);
            })
            .catch(console.error);
    }

    addToQueue(youtubeUrl: string) {
        this.queue
            .add(youtubeUrl)
            .then(() => {
                if (this.queue.songs.length === 1) {
                    this.playNextSong();
                }
            })
            .catch(console.error);
    }

    playNextSong() {
        console.log("Playing next song..");
        const song = this.queue.songs[0];

        if (song && song.video) {
            const duration = [];
            if (song.video.duration.hours)
                duration.push(song.video.duration.hours);
            if (song.video.duration.minutes)
                duration.push(song.video.duration.minutes);
            if (song.video.duration.seconds)
                duration.push(song.video.duration.seconds);

            setTimeout(() => {
                this.queue.songs.shift();
                this.playNextSong();
            }, 3 * 1000); // give a buffer of 2 seconds to play next track

            return `Playing ${song.video.title}; requested by <@${
                song.requestedBy
            }> [${duration.join(":")}]`;
        } else {
            console.log("No songs in queue.");
        }
    }

    nowPlaying() {
        const currentSong = this.queue.songs[0];
        console.log(
            `Now playing ${currentSong.video.title}; requested by ${
                currentSong.requestedBy
            }.`
        );
    }

    get length() {
        return this.queue.songs.length;
    }
}
