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

(Requirement: [Docker](https://docs.docker.com/install/))

Spin up the latest release by calling:

```sh
docker run -p 80:80 FelixGail/Musicbot-web:latest
```
