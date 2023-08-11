Elevation of Privilege
======================
[![Tests](https://github.com/tng/elevation-of-privilege/actions/workflows/checks.yml/badge.svg)](https://github.com/tng/elevation-of-privilege/actions/workflows/checks.yml)
[![Maintainability](https://api.codeclimate.com/v1/badges/5449a4d61cdfed258204/maintainability)](https://codeclimate.com/github/dehydr8/elevation-of-privilege/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/5449a4d61cdfed258204/test_coverage)](https://codeclimate.com/github/dehydr8/elevation-of-privilege/test_coverage)

Threat Modeling via Serious Games is the easy way to get started and increase the security of your projects. This is a card game that developers, architects or security experts can play.

This application implements an online version of the card games [Elevation of Privilege](https://download.microsoft.com/download/F/A/E/FAE1434F-6D22-4581-9804-8B60C04354E4/EoP_Whitepaper.pdf) and [OWASP Cornucopia](https://owasp.org/www-project-cornucopia/), allowing to play the threat modeling games in remote or geo-distributed developer teams.

![Example](docs/eop.gif)

**Improve both: your application's security and your developer's awareness!**

### Why Threat Modeling?

Nowadays, security is a topic that concerns every IT project. What if a malicious actor (for financial, ideological or any other reasons) wants to corrupt the system you are building? What if some skilled person wants to break in and steal your intellectual property or the data you are holding?

Threat Modeling is a systematic approach to the question "[What can go wrong?](https://www.threatmodelingmanifesto.org/)". It helps you and your team to take an attacker's perspective and understand your system aside from its features and business value. You will collect threats to your system and mitigate their risk before they get exploited and harm your business.  

### And why Serious Games?

The idea to perform threat modeling on a system using a serious card game as developed by the security department at Microsoft. At its core, threat modeling should be done continuously as part of the (agile) development process. Thus, it should also be done by the developers, as they are the real experts on the system.  

Microsoft's game allows developers, architects and security experts to find threats to the system even if they do not have a strong background in IT security. It is a threat catalog that guides the player's thoughts to new and unusual perspectives on the system, just as an attacker would do. Gamification makes this a fun thing to do and keeps the players motivated to find creative attacks.

But most important the game will teach the developers to look at the system with security in their mind. Therefore, it raises the awareness for security during implementation, avoiding threats from the start.

### How is this done?

In [Elevation of Privilege](https://download.microsoft.com/download/F/A/E/FAE1434F-6D22-4581-9804-8B60C04354E4/EoP_Whitepaper.pdf), the game invented by Microsoft, each card represents a particular attack on the system. The cards are meant as a starting point for brainstorming and discussions, if and where such an attack can be used on the system. During its flow the game guides the players through these threats in a structured manner. As a result a list of possible security weaknesses is generated.

## Card decks

Currently, three game modes are supported, reflecting different aspects of modern software development projects:

### Elevation of Privilege

This is the classic [Elevation of Privilege](https://shostack.org/games/elevation-of-privilege) game, developed by [Adam Shostack](https://github.com/adamshostack).
![card EoP](docs/EoP_cards_attributed.png)

### OWASP Cornucopia

Inspired by this, the game [Cornucopia](https://owasp.org/www-project-cornucopia/) has been developed by the [Open Web Application Security Project](https://owasp.org/) (OWASP). It specifically targets threat modeling of web application and might be an easy starting point for beginning threat modeling.

![card Cornucopia](docs/Cornucopia_cards_attributed.png)

### Cumulus

[Cumulus](https://github.com/TNG/cumulus), developed at [TNG Technology Consulting](https://www.tngtech.com/en/index.html), is a threat modeling game targeting cloud and DevOps setups.

![card Cumulus](docs/Cumulus_cards_attributed.png)

## For users

Currently, the game supports both card decks: 
    
* *Elevation of Privilege* and 
* *Cornucopia*,

more are to come. When uploading an architectural model of your system you can choose between different formats:

* an image (`.jpg`, `.png`, ...)
* JSON model generated with [OWASP Threat Dragon](https://owasp.org/www-project-threat-dragon/)
* no upload (this might be relevant you must comply to strict confidentiality regulation and want to supply the model via some different channel)

When starting the game you can configure the game mode and generate unique links for each of your players. With these links the players with their own hand of cards.

This game is intended to be supplemented by your favorite conferencing system. A crucial part are discussions between the players, so you better make sure your players can talk easily (e.g. via a video call).

Often it is beneficial (but not necessary!) to have a moderator, experienced in the game, who can steer the discussions and cut them off in case they run too long. For this role, a spectator mode is available in the game.

For the case of Elevation of Privilege, we partly support the latest version (as of April 2022) of the [EoP card deck](https://github.com/adamshostack/eop). However, we deviate in some Denial-of-Service cards. In particular, we still use the cards of an older version of the EoP card deck ([pre April 2020](https://github.com/adamshostack/eop/commit/a967aa273bfce60aa5eb4d7f2a37b6ae312ffd01)) for the cards `DoS3`, `DoS4` and `DoS5`. We do this because find the older versions better suited for our use cases.

## For developers

This repository allows you to build docker containers ready to be deployed e.g. to Kubernetes.

Frontend and backend are written in Javascript, although there are plans to migrate to Typescript. This game uses [boardgame.io](https://boardgame.io/) as a framework for turn based games. The backend furthermore exposes an API using [koa](https://koajs.com/). Frontend is written in [react](https://reactjs.org/).

### Running the app
There are two components that need to be started in order to run the game.
1. Server
2. UI/Client

#### Docker
To start a dockerized version of the game use

```bash
docker-compose up --build
```

This will start the app on port `8080` and make it accessible at [http://localhost:8080/](http://localhost:8080/).
The docker-compose setup starts two containers: 

* `threats-client`: running `nginx` as a reverse proxy and serving the react application
* `threats-server`: running the `nodejs` backends: public API and game server

![docker-compose setup](docs/docker-setup.svg)

#### Local deployment

The server can be started using:

```bash
npm run server
```

This will also automatically build the server first, compiling any TypeScript code, and then start the backend
application listening on the following ports:

| Application | Description                                                       | Environment Variable | Default |
|-------------|-------------------------------------------------------------------|----------------------|---------|
| Server      | The game server for boardgame, exposes socket.io endpoints        | `SERVER_PORT`        | 8000    |
| Lobby API   | Internal API for lobby operations, should not be exposed publicly | `INTERNAL_API_PORT`  | 8002    |
| Public API  | Public API to create games and retrieve game info                 | `API_PORT`           | 8001    |

 If you want to build the server code manually, you can do so by running

```bash
npm run build:server
```

The UI can be started using

```bash
npm start
```

which starts a watch mode that automatically compiles and reloads the UI every time source files are changed. The UI is
accessible at [http://localhost:3000/](http://localhost:3000/).

You can also build the client manually by running

```bash
npm run build:client
```

The UI can also be built and served statically (see the [dockerfile](docker/client.dockerfile)), keep in mind that the values of the port numbers will be hard coded in the generated files.

To build both the client and the server, just run

```bash
npm run build
```

#### Imprint and privacy notices

Links to imprint and privacy notices can be included into the client, if the environment variables

```bash
export REACT_APP_EOP_IMPRINT="https://example.tld/imprint/"
export REACT_APP_EOP_PRIVACY="https://example.tld/privacy/"
```

are set when building the app.
When building the client via docker these env vars can be set by defining `build-args`

```bash
docker build --build-arg "REACT_APP_EOP_IMPRINT=https://example.tld/imprint/" --build-arg "REACT_APP_EOP_PRIVACY=https://example.tld/privacy/" -f docker/client.dockerfile . -t "some-tag"
```

### Using MongoDB

As of boardgame.io v0.39.0, MongoDB is no longer supported as a database connector. There is currently no external library providing this functionality, however there is an [implementation](https://github.com/boardgameio/boardgame.io/issues/6#issuecomment-656144940) posted on github. This class implements the abstract functions in [this base class](https://github.com/boardgameio/boardgame.io/blob/ce8ef4a16bcc420b05c5e0751b41f168352bce7d/src/server/db/base.ts#L49-L111).

MongoDB has also been removed as a dependency so must be installed by running

```bash
npm install mongodb
```

An equivalent to `ModelFlatFile` should also be implemented. This extends the FlatFile database connector to allow the model to be saved to the database. The functions this implements are `setModel`, which allows the model to be set, and `fetch`, which is also overwritten to allow the model to be read in addition to the other properties. The implementations of these for the FlatFile object are available in `ModelFlatFile.ts`

Once the database connector is fully implemented, it can be used instead of a FlatFile by changing the object used in `config.ts`. Just replace `ModelFlatFile` with the name of the mongoDB database connector.

## TODO

### Migrate to Typescript

Work on migrating to TypeScript has already started but is not complete yet. Most of the server code and the code shared
between client snd server has already been migrated but a lot of the client is still missing.

In order to migrate a
component of the client to TypeScript, follow this pattern:

* Change the file extension of the file to `tsx`
* Create an interface for specifying the props of the component
* Use that interface when declaring the component
* Go through the rest of the file and fix any TypeScript or linter errors / warnings
* Change the extension of any accompanying test files to `tsx`
* Fix any potential errors in there

Among the files `src/client/pages/*.tsx` you will find different examples for how to set up TypeScript components.
### Other TODOs

* UI fixes (optimizations, smaller screens)
* Optimize the card sprite sheet (can look at SVGs)
* Improve test coverage, write tests for possible game states and moves
* Refactor and have reusable components
* Optimize component renders through `shouldComponentUpdate`
* Write contributing guide

## Credits
The card game Elevation of Privilege was originally invented by [Adam Shostack](https://adam.shostack.org/) at Microsoft and is licensed under [CC BY 3.0](https://creativecommons.org/licenses/by/3.0/). The [EoP Whitepaper](http://download.microsoft.com/download/F/A/E/FAE1434F-6D22-4581-9804-8B60C04354E4/EoP_Whitepaper.pdf) written by Adam can be downloaded which describes the motivation, experience and lessons learned in creating the game.

The card game Cornucopia was originally developed by the [OWASP Foundation](https://owasp.org/). In this application a slightly modified version of the original card game is used. This can be found in the subfolder `cornucopiaCards/`. As the original, the modified version is licensed under [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/). 

The motivation for creating this online version of the game at Careem was due to a large number of teams working remotely across several geographies and we wanted to scale our method of teaching threat modeling to our engineering teams.

The game is built using [boardgame.io](https://boardgame.io/), a framework for developing turn based games. The graphics, icons and card images used in this version were extracted from the original card game built by Microsoft.

Made with :green_heart: at Careem and [TNG Technology Consulting](https://www.tngtech.com/en/)
