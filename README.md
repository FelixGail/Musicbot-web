# MusicBot-web project

[![build-status](https://github.com/felixgail/musicbot-web/workflows/BUILD/badge.svg?branch=master)](https://github.com/FelixGail/Musicbot-web/actions)
[![Latest Release](https://img.shields.io/github/v/tag/FelixGail/MusicBot-web?label=Latest%20release)](https://github.com/FelixGail/Musicbot-web/releases)
[![GitHub](https://img.shields.io/github/license/felixgail/MusicBot-web)](https://github.com/FelixGail/Musicbot-web/blob/master/LICENSE)

A web client for the [MusicBot](https://github.com/BjoernPetersen/MusicBot) project.

# Install:

<details>
    <summary>Install executable</summary>
    
- Download the latest executable for your architecture from the         [release section](https://github.com/FelixGail/MusicBot-web/releases).

- Start the executable.<br>
  _Since the executable is not signed with a verified certificate. Windows will block its execution. To start click on "More information" and then "Start anyway"_.
  </details>

<details>
    <summary>Install with <a href="https://scoop.sh">scoop</a></summary>

```
scoop install https://github.com/FelixGail/Musicbot-web/releases/latest/download/scoop-manifest.json
```

</details>

<details>
    <summary>Install using pre-build-files</summary>

### Requirements:

- [Node](https://nodejs.org/en/) > 8
- [npm](https://www.npmjs.com/)
- [yarn](https://www.npmjs.com/package/yarn)

### Steps:

1. Download the latest `musicbot-web.zip` from the [release section](https://github.com/FelixGail/MusicBot-web/releases).
2. Extract the zip and enter the directory
3. Install server dependencies:
   ```
   yarn install --frozen-lockfile
   ```
4. [Configure](#configuration) the application.
5. Start the application:
   ```
   node index.js [options]
   ```
   </details>

<details>
    <summary>Install from source</summary>

### Requirements:

- [Node](https://nodejs.org/en/)
- [npm](https://www.npmjs.com/)
- [yarn](https://www.npmjs.com/package/yarn)
- [git](https://git-scm.com/)

### Steps:

1. Clone the repository:

   `git clone https://github.com/FelixGail/MusicBot-web.git`

2. Change into the newly created directory:

   `cd MusicBot-web`

3. Install the dependencies:

   `yarn && yarn bootstrap`

4. Build the project:

   `yarn build`

5. Start directly:

   `yarn start`

6. OR Build a executable

   1. Create the executable. _Exchange the tag `<NAME_OF_YOUR_EXECUTABLE>` with a name of your liking_:

      `yarn pkg -o <NAME_OF_YOUR_EXECUTABLE>`

   2. Start the executable.

</details>

<details>
    <summary>Install using Docker</summary>

- Using [docker](https://docs.docker.com/install/) directly:

  ```
  docker run -p <PORT>:8080 felixgail/musicbot-web
  ```

  The application is now accessible at `http://musicbot.local:<PORT>`

- Using [docker-compose](https://docs.docker.com/compose/):

  docker-compose makes it easier to persist your configuration data.
  Create a `docker.compose.yml` file that looks like this.
  Edit the ports, so they reflect the port you want to expose your application on:

  ```
  version: "3"
  services:
    server:
      image: felixgail/musicbot-web
      ports:
        - "8080:8080"
      volumes:
        - "./config.json:/usr/src/app/config/config.json"
  ```

  Create a `config.json` file in the same directory, in which you save your [configuration](#configuration).

  Start your application with `docker-compose up`

  </details>

## Configuration:

The project can be configured using configuration files or command-line arguments.
If multiple are available the application will use (in-order from most relevant to least):

- Command-line arguments
- `config.json`-file in a `config`-folder inside the project. e.g. `${PROJECT_PATH}/config/config.json`

| Config-file key | Command-line key |                                          Description                                          |                Default |
| --------------- | :--------------: | :-------------------------------------------------------------------------------------------: | ---------------------: |
| domain          |   -l, --domain   | .local-domain to advertise. Default is musicbot, therefore allowing access via musicbot.local |               musicbot |
| port            |    -p, --port    |                                     Port of the webserver                                     |                   8080 |
| remote          |   -r, --remote   |        Address of the [MusicBot](https://github.com/BjoernPetersen/MusicBot) instance         | http://localhost:42945 |
