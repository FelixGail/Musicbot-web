#!/usr/bin/env node

const express = require("express");
const path = require("path");
const ip = require("ip");
const proxy = require("express-http-proxy");
const bonjour = require("bonjour")();
const Server = require("node-ssdp").Server;
const fs = require("fs");
const nconf = require("nconf");

nconf
  .argv(
    require("yargs")
      .version()
      .alias("v", "version")
      .help()
      .alias("h", "help")
      .options({
        p: {
          alias: "port",
          type: "number",
          describe: "Port of the webserver"
        },
        r: {
          alias: "remote",
          type: "string",
          describe: "Address of the MusicBot-instance",
          check: value => value.match(/^https?:\/\/[\S]+:\d+$/i)
        },
        l: {
          alias: "localdomain",
          type: "string",
          describe:
            "domain to advertise. Default is musicbot, therefore allowing access via musicbot.local"
        }
      })
  )
  .file("config", { file: "./config.json" })
  .file("musicbot", { file: "~/.config/musicbot.json" })
  .defaults({
    port: 8080,
    remote: "http://localhost:42945",
    localdomain: "musicbot"
  });

console.log(`\nApi requests will be proxied to ${nconf.get("remote")}\n`);

bonjour.publish({
  name: nconf.get("localdomain"),
  host: `${nconf.get("localdomain")}.local`,
  type: "http",
  port: nconf.get("port")
});

const server = new Server();
server.addUSN(`${nconf.get("localdomain")}.local._http._tcp.local`);
server.start();
process.on("exit", function() {
  server.stop(); // advertise shutting down and stop listening
});

const app = express();
const clientDir = path.join(__dirname, "..", "client");
app.use(express.static(path.join(clientDir, "build")));
app.use("/api", proxy(nconf.get("remote")));
app.get("/*", (req, res) => {
  res.sendFile(path.join(clientDir, "build", "index.html"));
});
app.listen(nconf.get("port"), () => {
  console.log(
    `Server started on port ${nconf.get("port")}.\n\n` +
      `Access it via \n  http://${nconf.get("localdomain")}.local:${nconf.get(
        "port"
      )}\nor\n  http://${ip.address()}:${nconf.get("port")}.`
  );
});
