import { createServer } from "node:http";
import path from "node:path";

import { stat, readdir, files } from "./filesystem/base.js";

const hostname = "127.0.0.1";
const port= 3000;

const server =  createServer((req, res) => {
    
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});

const pastrequests = [];

server.on("request", (req, res) => {
    if (req.method === "GET") {         
        const _default = !["/stat", "/frontend", "/app"].some((route) => route === req.url);

        if (_default) {
            Promise.resolve()
                .then(() => {
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "text/plain");
                    res.end(`GET Request for: ${req.url}\n${pastrequests.join("\n")}`);
                });
        } else {
            if (req.url === "/stat") {
                stat("frontend/index.html")
                    .then(({ size }) => {
                        res.statusCode = 200;
                        res.setHeader("Content-Type", "text/plain");
                        res.end(`The base file system library is: ${size}B big!`);
                    })
            }

            if (req.url === "/frontend") {
                readdir("frontend")
                    .then(({ entities }) => {
                        res.statusCode = 200;
                        res.setHeader("Content-Type", "text/plain");
                        res.end(`frontend contains ${entities.length} file/s:\n ${entities.join("\n")}`);
                    })
            }

            if (req.url === "/app") {
                files("frontend")
                    .then(({ files }) => {
                        const entrypoint = files.find((file) => file.includes("index.html"));
                        const others = files.filter((file) => !file.includes("index.html"));

                        res.statusCode = 200;
                        res.setHeader("Content-Type", "text/plain");
                        res.end(`Found app entypoint at ${entrypoint}\n Other files are: \n ${others.join("\n")}`);
                    })
            }
        }

        pastrequests.push(req.url);
    } else {
        res.statusCode = 500;
        res.setHeader("Content-Type", "text/plain");
        res.end(`unknown request method. ${req.method}`); 
    }
});

/*    */