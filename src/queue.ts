"use strict";

import { Song } from "./song";

export class Queue {
    songs: Song[] = [];
    youtube: any;

    constructor(youtube?: any) {
        this.setYoutube(youtube);
    }

    setYoutube(youtube: any) {
        this.youtube = youtube;
    }

    add(youtubeUri: string) {
        const song: Song = new Song(this.youtube);
        this.songs.push(song);

        console.log(
            `Added song ${youtubeUri}. There are ${
                this.songs.length
            } songs in the queue.`
        );
        return song.init(youtubeUri);
    }

    remove(songId: string) {
        const songIndex: number = this.songs.findIndex(
            song => song.uid === songId
        );
        const song: Song = this.songs[songIndex];
        if (song) {
            this.songs.splice(songIndex, 1);
            console.log(
                `Removed song ${song.video.title}; requested by <@${
                    song.requestedBy
                }>.`
            );
        } else {
            console.log(`No song by the id ${songId}.`);
        }
    }

    get length() {
        return this.songs.length;
    }
}
