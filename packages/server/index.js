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
      .version("{{version}}")
      .alias("v", "version")
      .help()
      .alias("h", "help")
      .showHelpOnFail()
      .usage("Usage: $0 [-p <port>] [-r <url>] [-l <string>] [-reg <url>]")
      .check(argv => {
        if (argv.p && isNaN(argv.p)) {
          throw new Error("'port' has to be a number");
        }
        if (argv.remote && !argv.remote.match(/^https?:\/\/[\S]+:\d+$/i)) {
          throw new Error(
            "'remote' has to be of format 'http(s)://<host>:<port>'"
          );
        }
        if (argv.registry && !argv.registry.match(/^https?:\/\/[\S]+:\d+$/i)) {
          throw new Error(
            "'registry' has to be of format 'http(s)://<host>:<port>'"
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
        reg: {
          alias: "registry",
          type: "string",
          describe: "Address of the registry instance",
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
    domain: "musicbot",
    registry: "http://localhost:8000"
  });


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
if(nconf.get("remote")) {
  app.get("/registry", (req, res) => {
    res.json([
      {
        "name": "Default",
        "updated": Date.now(),
        "address": nconf.get("remote")
      }
    ])
  })
} else {
  app.use("/registry", proxy(nconf.get("registry")));
}
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
