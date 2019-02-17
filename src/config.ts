"use strict";

import Keyv from "keyv";
const dotenv = require("dotenv");
dotenv.config();

interface IConfigOptions {
    [x: string]: any;
}

export class Config {
    props: Keyv;
    prefix: string;

    constructor(options?: IConfigOptions[]) {
        this.props = new Keyv("sqlite://configuration.sqlite");

        if (options) {
            options.map(option => {
                const k = Object.keys(option)[0];
                this.props.set(k, option[k]);
            });
        }
    }

    importFromEnv() {
        const envVars = ["YOUTUBE_API_KEY", "DISCORD_TOKEN"];

        Object.keys(process.env).map(env => {
            if (envVars.includes(env)) {
                this.props.set(env, process.env[env]);
                console.log(`Set config var ${env}.`);
            }
        });
    }

    get(keys: string[]) {
        return new Promise((resolve, reject) => {
            const promises = keys.map(key => this.props.get(key));
            Promise.all(promises)
                .then(fetched => {
                    resolve(fetched);
                })
                .catch(reject);
        });
    }
}
