# MusicBot-web project

[![build-status](https://github.com/felixgail/musicbot-web/workflows/BUILD/badge.svg?branch=master)](https://github.com/FelixGail/Musicbot-web/actions)
[![Latest Release](https://img.shields.io/github/v/tag/FelixGail/MusicBot-web?label=Latest%20release)](https://github.com/FelixGail/Musicbot-web/releases)
[![GitHub](https://img.shields.io/github/license/felixgail/MusicBot-web)](https://github.com/FelixGail/Musicbot-web/blob/master/LICENSE)

A web client for the [MusicBot](https://github.com/BjoernPetersen/MusicBot) project.

## Install:

- Download the latest build for your architecture from the [release section](https://github.com/FelixGail/MusicBot-web/releases).
- Start the executable.

## Install from source:

### Requirements:

- [Node](https://nodejs.org/en/)
- [npm](https://www.npmjs.com/)
- [yarn](https://www.npmjs.com/package/yarn)
- [git](https://git-scm.com/)

### Step by step:

1. Clone the repository:

   `git clone https://github.com/FelixGail/MusicBot-web.git`

2. Change into the newly created directory:

   `cd MusicBot-web`

3. Install the dependencies:

   `yarn && yarn bootstrap`

4. Build the project:

   `yarn build`

5. Create the executable. _Exchange the tag `<NAME_OF_YOUR_EXECUTABLE>` with a name of your liking_:

   `yarn pkg -o <NAME_OF_YOUR_EXECUTABLE>`

6. Start the executable.

## Configuration:

The project can be configured using configuration files or command-line arguments.
If multiple are available the application will use (in-order from most relevant to least):

- Command-line arguments
- `config.json`-file in the project folder
- Configuration file at `~/.config/musicbot.json`

| Config-file key | Command-line key |                                          Description                                          |                Default |
| --------------- | :--------------: | :-------------------------------------------------------------------------------------------: | ---------------------: |
| domain          |   -l, --domain   | .local-domain to advertise. Default is musicbot, therefore allowing access via musicbot.local |               musicbot |
| port            |    -p, --port    |                                     Port of the webserver                                     |                   8080 |
| remote          |   -r, --remote   |        Address of the [MusicBot](https://github.com/BjoernPetersen/MusicBot) instance         | http://localhost:42945 |
