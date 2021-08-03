Elevation of Privilege
======================
[![Build Status](https://travis-ci.org/dehydr8/elevation-of-privilege.svg?branch=master)](https://travis-ci.org/dehydr8/elevation-of-privilege)
[![Maintainability](https://api.codeclimate.com/v1/badges/5449a4d61cdfed258204/maintainability)](https://codeclimate.com/github/dehydr8/elevation-of-privilege/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/5449a4d61cdfed258204/test_coverage)](https://codeclimate.com/github/dehydr8/elevation-of-privilege/test_coverage)

Elevation of Privilege (EoP) is the easy way to get started and learn threat modeling. It is a card game that developers, architects or security experts can play.

The deployed version can be found here: https://elevation-of-privilege.herokuapp.com/

## Running
There are two components that need to be started in order to run the game.
1. Server
2. UI/Client

### Development/local
The server can be started using:
```
npm run server
```
There are 3 [koa](https://koajs.com/) apps that bind on the respective ports:

| Application | Description | Environment Variable | Default |
|-------------|-------------------------------------------------------------------|----------------------|---------|
| Server | The game server for boardgame, exposes socket.io endpoints | `SERVER_PORT` | 8000 |
| Lobby API | Internal API for lobby operations, should not be exposed publicly | `INTERNAL_API_PORT` | 8002 |
| Public API | Public API to create games and retrieve game info | `API_PORT` | 8001 |

The UI can be started using:
```
npm run start
```
The UI can also be built and served statically, keep in mind that the values of the port numbers will be hard coded in the generated files.

### Docker
To start a dockerized version of the EoP game use

```bash
docker-compose up --build
```

This would start EoP on port `8080` and would be accessible at `http://localhost:8080/`.
The docker-compose setup starts two container: 
 * `threats-client`: running `nginx` as a reverse proxy and serving the react application
 * `threats-server`: running the `nodejs` backends: public API and game server

![docker-compose setup](docs/docker-setup.svg)

## TODO
* Spectator mode
* UI fixes (optimizations, smaller screens)
* Upload an image instead of a model. Might need restructuring as we rely on diagram components + reporting would change
* Optimize the card sprite sheet (can look at SVGs)
* Improve test coverage, write tests for possible game states and moves
* Refactor and have reusable components
* Optimize component renders through `shouldComponentUpdate`
* Write contributing guide

## Using MongoDB
As of boardgame.io v0.39.0, MongoDB is no longer supported as a database connector. There is currently no external library providing this functionality, however there is an [implementation](https://github.com/boardgameio/boardgame.io/issues/6#issuecomment-656144940) posted on github. This class implements the abstract functions in [this base class](https://github.com/boardgameio/boardgame.io/blob/ce8ef4a16bcc420b05c5e0751b41f168352bce7d/src/server/db/base.ts#L49-L111).

MongoDB has also been removed as a dependency so must be installed by running
```
npm install mongodb
```

An equivalent to `ModelFlatFile` should also be implemented. This extends the FlatFile database connector to allow the model to be saved to the database. The functions this implements are `setModel`, which allows the model to be set, and `fetch`, which is also overwritten to allow the model to be read in addition to the other properties. The implementations of these for the FlatFile object are available in `ModelFlatFile.js`

Once the database connector is fully implemented, it can be used instead of a FlatFile by changing the object used in `config.js`. Just replace `ModelFlatFile` with the name of the mongoDB database connector.

## Credits
The game was originally invented by [Adam Shostack](https://adam.shostack.org/) at Microsoft. The [EoP Whitepaper](http://download.microsoft.com/download/F/A/E/FAE1434F-6D22-4581-9804-8B60C04354E4/EoP_Whitepaper.pdf) written by Adam can be downloaded which describes the motivation, experience and lessons learned in creating the game.

The motivation for creating this online version of the game at Careem was due to a large number of teams working remotely across several geographies and we wanted to scale our method of teaching threat modeling to our engineering teams.

The game is built using [boardgame.io](https://boardgame.io/), a framework for developing turn based games. The graphics, icons and card images used in this version were extracted from the original card game built by Microsoft.

Made with :green_heart: at Careem and [TNG Technology Consulting](https://www.tngtech.com/en/)
