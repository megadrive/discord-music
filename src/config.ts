"use strict";

import Keyv from "keyv";
const dotenv = require("dotenv");

interface IConfigOptions {
    [x: string]: any;
}

export class Config {
    props: Keyv;
    prefix: string = "!";

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
        const defaultVars = Object.keys(process.env);
        dotenv.config();

        Object.keys(process.env).map(env => {
            if (!defaultVars.includes(env)) {
                this.props.set(env, process.env[env]);
                console.log(`Set config var ${env}.`);
            }
        });

        // special case for prefix, set it locally.
        this.props.get("PREFIX").then(prefix => {
            if (prefix) this.prefix = prefix;
        });
    }

    get(keys: string[]) {
        return new Promise((resolve, reject) => {
            const promises = keys.map(key => this.props.get(key));
            Promise.all(promises)
                .then(fetched => {
                    let rv: IConfigOptions = {};
                    fetched.forEach((value, index) => {
                        rv[keys[index]] = value;
                    });
                    resolve(rv);
                })
                .catch(reject);
        });
    }
}
