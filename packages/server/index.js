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
      .showHelpOnFail()
      .usage("Usage: $0 [-p <port>] [-r <url>] [-l <string>]")
      .check(argv => {
        if (argv.p && isNaN(argv.p)) {
          throw new Error("'port' has to be a number");
        }
        if (argv.remote && !argv.remote.match(/^https?:\/\/[\S]+:\d+$/i)) {
          throw new Error(
            "'remote' has to be of format 'http(s)://<host>:<port>'"
          );
        }
        if (argv.domain && argv.domain.match(/^\S+$/i)) {
          throw new Error("'domain' cannot contain whitespace characters.");
        }
        return true;
      })
      .options({
        p: {
          alias: "port",
          describe: "Port of the webserver",
          nargs: 1
        },
        r: {
          alias: "remote",
          type: "string",
          describe: "Address of the MusicBot-instance",
          nargs: 1
        },
        l: {
          alias: "domain",
          type: "string",
          describe:
            ".local-domain to advertise. Default is musicbot, therefore allowing access via musicbot.local",
          nargs: 1
        }
      })
  )
  .file("config", { file: "config/config.json" })
  .defaults({
    port: 8080,
    remote: "http://localhost:42945",
    domain: "musicbot"
  });

console.log(`\nApi requests will be proxied to ${nconf.get("remote")}\n`);

bonjour.publish({
  name: nconf.get("domain"),
  host: `${nconf.get("domain")}.local`,
  type: "http",
  port: nconf.get("port")
});

const server = new Server();
server.addUSN(`${nconf.get("domain")}.local._http._tcp.local`);
server.start();
process.on("exit", function() {
  server.stop(); // advertise shutting down and stop listening
});

const app = express();
const buildDir = path.join(__dirname, "build");
app.use(express.static(buildDir));
app.use("/api", proxy(nconf.get("remote")));
app.get("/*", (req, res) => {
  res.sendFile(path.join(buildDir, "index.html"));
});
app.listen(nconf.get("port"), () => {
  console.log(
    `Server started on port ${nconf.get("port")}.\n\n` +
      `Access it via \n  http://${nconf.get("domain")}.local:${nconf.get(
        "port"
      )}\nor\n  http://${ip.address()}:${nconf.get("port")}.`
  );
});
