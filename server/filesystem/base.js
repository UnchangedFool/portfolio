import fs from "node:fs";
import path from "node:path";

export const stat = (filepath) => {
    return new Promise((resolve, reject) => {
        fs.stat(filepath, (err, stats) => {
            if (err) {
                reject(err);
            }

            resolve(stats);
        });
    });
};

export const readdir = (filepath)  => {
    return stat(filepath)
        .then((stats) => {
            if (stats.isDirectory()) {
                return stats;
            }

            return Promise.reject({ error: `${filepath} is not a directory`});
        })
        .then(() => {
            return new Promise((resolve, reject) => {
                fs.readdir(filepath, (err, entities) => {
                    if (err) {
                        reject(err);
                    }

                    resolve({entities});
                })
            });
        })
};

export const files = (filepath)  => {
    return readdir(filepath)
        .then(({ entities }) => {
            const statChecks = entities
                .map((entity) => path.join(filepath, entity))
                .map((subfile) => {
                    return stat(subfile)
                        .then((stat) => {
                            return { stat, isFile: stat.isFile(), path: subfile };
                        })
                });
            
            return Promise.all(statChecks)
                .then((checks) => ({ files: checks.filter((check) => check.isFile).map((check) => check.path) }))
        }); 
};
