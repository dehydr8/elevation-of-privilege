import { gameServer, gameServerHandle, publicApiServer, publicApiServerHandle } from '../server'
import request from 'supertest'
import { ElevationOfPrivilege } from '../../game/eop';

it('gameServer is not undefined', async() => {
  expect(gameServer).toBeDefined();
});

it('creates a game without a model', async () => {
  const players = 3;
  const response = await request(publicApiServer.callback())
    .post("/create")
    .send({
      players: players,
      names: [
        "P1", "P2", "P3"
      ]
    });
  expect(response.body.game).toBeDefined();
  expect(response.body.credentials.length).toBe(players);
});

it('retrieves player info for a game', async () => {
  const players = 3;
  let response = await request(publicApiServer.callback())
    .post("/create")
    .send({
      players: players,
      names: [
        "P1", "P2", "P3"
      ]
    });
  expect(response.body.game).toBeDefined();
  expect(response.body.credentials.length).toBe(players);

  response = await request(publicApiServer.callback()).get(`/players/${response.body.game}`);
  expect(response.body.players.length).toBe(players);
});

it('creates a game with a model', async () => {
  const players = 3;
  const response = await request(publicApiServer.callback())
    .post("/create")
    .send({
      players: players,
      names: [
        "P1", "P2", "P3"
      ],
      model: {
        
      }
    });
  expect(response.body.game).toBeDefined();
  expect(response.body.credentials.length).toBe(players);
});

it('retrieve the model for a game', async () => {
  const players = 3;
  const model = { foo: "bar" };

  let response = await request(publicApiServer.callback())
    .post("/create")
    .send({
      players: players,
      names: [
        "P1", "P2", "P3"
      ],
      model: model
    });
  expect(response.body.game).toBeDefined();
  expect(response.body.credentials.length).toBe(players);

  // retrieve the model
  response = await request(publicApiServer.callback()).get(`/model/${response.body.game}`);
  expect(response.body).toStrictEqual(model)
});

it('download the final model for a game', async () => {
  const gameName = ElevationOfPrivilege.name;
  const gameID = "1234567";

  const state = {
    G: {
      identifiedThreats: {
        "0": {
          "component-1": {
            "threat-1": {
              id: "0",
              severity: "High",
              type: "S",
              title: "title",
              description: "description",
              mitigation: "mitigation",
              owner: "0",
            }
          },
          "component-2": {
            "threat-2": {
              id: "0",
              severity: "High",
              type: "S",
              title: "title",
              description: "description",
              mitigation: "mitigation",
              owner: "0",
            }
          },
          "component-3": {
            "threat-3": {
              id: "0",
              severity: "High",
              type: "S",
              title: "title",
              description: "description",
              mitigation: "mitigation",
              owner: "0",
            }
          }
        }
      }
    }
  };

  const metadata = {
    players: {
      "0": "P1",
      "1": "P2",
    }
  };

  const model = {
    summary: {
      title: "Foo",
    },
    detail: {
      diagrams: [{
        diagramJson: {
          cells: [{
            id: "component-1",
            threats: []
          }, {
            id: "component-2"
          }]
        }
      }]
    }
  };

  await gameServer.db.set(`${gameName}:${gameID}`, state);
  await gameServer.db.set(`${gameName}:${gameID}:metadata`, metadata);
  await gameServer.db.set(`${gameName}:${gameID}:model`, model);

  // retrieve the model
  const response = await request(publicApiServer.callback()).get(`/download/${gameID}`);
  const threats = response.body.detail.diagrams[0].diagramJson.cells[0].threats;
  expect(threats[0].id).toBe("0");
  expect(threats[0].type).toBe("Spoofing");
  expect(threats[0].title).toBe("title");
  expect(threats[0].description).toBe("description");
  expect(threats[0].mitigation).toBe("mitigation");
  expect(threats[0].game).toBe(gameID);
});

afterAll(() => {
  // cleanup
  gameServerHandle.then(s => {
    s.apiServer.close();
    s.appServer.close();
  });
  publicApiServerHandle.close();
});