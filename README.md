# MusicBot-web project

[![build-status](https://github.com/felixgail/musicbot-web/workflows/BUILD/badge.svg?branch=master)](https://github.com/FelixGail/Musicbot-web/actions)
[![Latest Release](https://img.shields.io/github/v/tag/FelixGail/MusicBot-web?label=Latest%20release)](https://github.com/FelixGail/Musicbot-web/releases)
[![GitHub](https://img.shields.io/github/license/felixgail/MusicBot-web)](https://github.com/FelixGail/Musicbot-web/blob/master/LICENSE)

A web client for the [MusicBot](https://github.com/BjoernPetersen/MusicBot) project.

## Install using pre-built files

1. Download the latest `musicbot-web.zip` from the [release section](https://github.com/FelixGail/MusicBot-web/releases).
2. Extract the zip and enter the directory
3. Configure a [registry](https://github.com/FelixGail/Musicbot-registry) instance
4. Edit the `config.json` file to link to your registry
5. Serve the pre-build files with a http-server of your choice.

## Install using Docker and docker-compose

### Requirements

- [Docker](https://docs.docker.com/install/)
- [docker-compose](https://docs.docker.com/compose/)

### Steps

1. Create a [Caddyfile](https://caddyserver.com/docs/caddyfile) that looks roughly like this, but where `YOUR_HOST` is replaced with your domain:

   ```Caddyfile
   YOUR_DOMAIN {
      root * /app/build
      try_files {path} {path}/ index.html
      file_server
   }

   registry.YOUR_DOMAIN {
      reverse_proxy registry:8000
   }
   ```

2. Create a `config.json` file that configures where the client should look for the registry:

   ```json
   {
      "registry": "https://registry.YOUR_DOMAIN"
   }
   ```

3. Create your `docker-compose.yml` file:

   ```yml
   version: '3'
   services:
      site:
         image: felixgail/musicbot-web:latest
         ports:
               - "80:80"
               - "443:443"
         volumes:
               - "./config.json:/app/config.json"
               - "./Caddyfile:/etc/caddy/Caddyfile"
      registry:
         image: felixgail/musicbot-registry:latest
   ```

4. Use `docker-compose up -d` to start the containers. You now have a `Musicbot-web` and a `Musicbot-registry` running.
