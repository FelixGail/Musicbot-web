#!/usr/bin/env node

const express = require('express');
const path = require('path');
var ip = require('ip');
var proxy = require('express-http-proxy');
var bonjour = require('bonjour')()
const Server = require('node-ssdp').Server
var program = require('commander');

program
  .version('0.1.0')
  .option('-p --port <port>', 'port of the webserver', /^(\d)+$/i, 8080)
  .option('-r --remote <url:port>', 'address of the musicbot', /^https?:\/\/[\S]+:\d+$/i, 'http://localhost:42945')
  .option('-l --localdomain <host>', 'host to advertise on .local domain', 'musicbot')
  .parse(process.argv)

bonjour.publish({ name: program.localdomain, host: `${program.localdomain}.local`, type: 'http', port: program.port }) 

const server = new Server()
server.addUSN(`${program.localdomain}.local._http._tcp.local`)
server.start();
process.on('exit', function(){
  server.stop() // advertise shutting down and stop listening
})

const app = express();
const clientDir = path.join(__dirname, '..', 'client');
app.use(express.static(path.join(clientDir, 'build')));
app.use('/api', proxy(program.remote))
app.get('/*', (req, res) => {
  res.sendFile(path.join(clientDir, 'build', 'index.html'));
});
app.listen(program.port, () => {
  console.log(`Server started on port ${program.port}.\n` +
  `Access it via \n  http://${program.localdomain}.local:${program.port}\nor\n  http://${ip.address()}:${program.port}.`);
})
