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


it("Download threat file", async () => {
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

  //Maybe I should put these jsons into a file
  const model = {
    "summary": {
      "title": "Demo Threat Model"
    },
    "detail": {
      "diagrams": [
        {
          "diagramJson": {
            "cells": [
              {
                "threats": [
                  {
                    "status": "Open",
                    "severity": "High",
                    "mitigation": "Encrypt the DB credentials in the configuration file.\n\nExpire and replace the DB credentials regularly.",
                    "description": "The Background Worker configuration stores the credentials used by the worker to access the DB. An attacker could compromise the Background Worker and get access to the DB credentials.",
                    "title": "Accessing DB credentials",
                    "type": "Information disclosure"
                  }
                ],
                "hasOpenThreats": true
              },
              {
                "threats": [
                  {
                    "status": "Mitigated",
                    "severity": "High",
                    "description": "An attacker could make an query call on the DB,",
                    "title": "Unauthorised access",
                    "type": "Information disclosure",
                    "mitigation": "Require all queries to be authenticated."
                  },
                  {
                    "status": "Open",
                    "severity": "Medium",
                    "description": "An attacker could obtain the DB credentials ans use them to make unauthorised queries.",
                    "title": "Credential theft",
                    "type": "Information disclosure",
                    "mitigation": "Use a firewall to restrict access to the DB to only the Background Worker IP address.",
                    "owner": "The Model"
                  }
                ],
                "hasOpenThreats": true
              },
              {
                "threats": [
                  {
                    "status": "Open",
                    "severity": "High",
                    "title": "Credentials should be encrypted",
                    "type": "Information disclosure",
                    "description": "The Web Application Config stores credentials used  by the Web App to access the message queue.\r\n\r\nThese could be stolen by an attacker and used to read confidential data or place poison message on the queue.",
                    "mitigation": "The Message Queue credentials should be encrypted.\n\n\n\n\nnewlines shouldn't\nbreak the formatting"
                  }
                ],
                "hasOpenThreats": false
              },
              {
                "hasOpenThreats": false
              },
              {
                "hasOpenThreats": true
              },
              {
              }
            ]
          }
        }
      ]
    }
  };

  const metadata = {
    "players": {
      "0": {
        "id": 0,
          "credentials": "30d1cdc1-110c-46f7-8178-e3fedcc71e3d",
          "name": "Player 1"
      },
      "1": {
        "id": 1,
        "credentials": "7f76dc60-665a-4068-b3de-0ab7b00fcb6f",
        "name": "Player 2"
      }
    }
  }

  await gameServer.db.set(`${gameName}:${gameID}`, state);
  await gameServer.db.set(`${gameName}:${gameID}:metadata`, metadata);
  await gameServer.db.set(`${gameName}:${gameID}:model`, model);
  
  const date = new Date().toLocaleString();

  // retrieve the model
  const response = await request(publicApiServer.callback()).get(`/download/text/${gameID}`);
  expect(response.text).toBe(`Threats ${date}
=======

**1. title**

  - *Author:*       Player 1

  - *Description:*  description

  - *Mitigation:*   mitigation


**2. title**

  - *Author:*       Player 1

  - *Description:*  description

  - *Mitigation:*   mitigation


**3. title**

  - *Author:*       Player 1

  - *Description:*  description

  - *Mitigation:*   mitigation


**4. Accessing DB credentials**

  - *Description:*  The Background Worker configuration stores the credentials used by the worker to access the DB. An attacker could compromise the Background Worker and get access to the DB credentials.

  - *Mitigation:*   Encrypt the DB credentials in the configuration file. Expire and replace the DB credentials regularly.


**5. Unauthorised access**

  - *Description:*  An attacker could make an query call on the DB,

  - *Mitigation:*   Require all queries to be authenticated.


**6. Credential theft**

  - *Author:*       The Model

  - *Description:*  An attacker could obtain the DB credentials ans use them to make unauthorised queries.

  - *Mitigation:*   Use a firewall to restrict access to the DB to only the Background Worker IP address.


**7. Credentials should be encrypted**

  - *Description:*  The Web Application Config stores credentials used  by the Web App to access the message queue. These could be stolen by an attacker and used to read confidential data or place poison message on the queue.

  - *Mitigation:*   The Message Queue credentials should be encrypted. newlines shouldn't break the formatting

`
  )
});

afterAll(() => {
  // cleanup
  gameServerHandle.then(s => {
    s.apiServer.close();
    s.appServer.close();
  });
  publicApiServerHandle.close();
});