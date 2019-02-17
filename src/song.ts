"use strict";

import { EventEmitter } from "events";
import { emit } from "cluster";

export class Song {
    youtube: any;

    /** The YouTube.Video instance. */
    video: any;

    /** Discord ID of user who requested. */
    requestedBy: string = "";

    /** Unique ID */
    uid: string = "";

    constructor(youtube: any) {
        this.youtube = youtube;
    }

    init(youtubeUri: any) {
        return new Promise((resolve, reject) => {
            this.youtube
                .getVideo(youtubeUri)
                .then((video: any) => {
                    this.video = video;
                    this.uid = video.id;
                    resolve();
                })
                .catch((err: any) => {
                    console.error(err);
                    reject(err);
                });
        });
    }
}
