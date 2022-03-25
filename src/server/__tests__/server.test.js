import request from 'supertest';
import { GameMode, ModelType, SPECTATOR } from '../../utils/constants';
import {
  gameServer,
  gameServerHandle,
  publicApiServer,
  publicApiServerHandle,
} from '../server';

it('gameServer is not undefined', async () => {
  expect(gameServer).toBeDefined();
});

it('creates a game without a model', async () => {
  const players = 3;
  const response = await request(publicApiServer.callback())
    .post('/game/create')
    .field('players', players)
    .field('names[]', ['P1', 'P2', 'P3']);
  expect(response.body.game).toBeDefined();
  expect(response.body.credentials.length).toBe(players);
});

it('retrieves player info for a game', async () => {
  const players = 3;
  const names = ['P1', 'P2', 'P3'];
  let response = await request(publicApiServer.callback())
    .post('/game/create')
    .field('players', players)
    .field('names[]', names);
  expect(response.body.game).toBeDefined();
  expect(response.body.credentials.length).toBe(players);

  response = await request(publicApiServer.callback())
    .get(`/game/${response.body.game}/players`)
    .auth('0', response.body.credentials[0]);
  expect(response.body.players.length).toBe(players);
  response.body.players.forEach((p, i) => {
    expect(p.name).toBe(names[i]);
  });
});

it('creates a game with a model', async () => {
  const players = 3;
  const response = await request(publicApiServer.callback())
    .post('/game/create')
    .field('players', players)
    .field('names[]', ['P1', 'P2', 'P3'])
    .field('modelType', ModelType.THREAT_DRAGON)
    .field('model', JSON.stringify({}));
  expect(response.body.game).toBeDefined();
  expect(response.body.credentials.length).toBe(players);
});

it('retrieve the model for a game', async () => {
  const players = 3;
  const model = { foo: 'bar' };

  let response = await request(publicApiServer.callback())
    .post('/game/create')
    .field('players', players)
    .field('names[]', ['P1', 'P2', 'P3'])
    .field('modelType', ModelType.THREAT_DRAGON)
    .field('model', JSON.stringify(model));
  expect(response.body.game).toBeDefined();
  expect(response.body.credentials.length).toBe(players);

  // retrieve the model
  response = await request(publicApiServer.callback())
    .get(`/game/${response.body.game}/model`)
    .auth('0', response.body.credentials[0]);
  expect(response.body).toStrictEqual(model);
});

it('download the final model for a game', async () => {
  const matchID = '123456';

  const state = {
    G: {
      modelType: ModelType.THREAT_DRAGON,
      gameMode: GameMode.EOP,
      identifiedThreats: {
        0: {
          'component-1': {
            'threat-1': {
              id: '0',
              severity: 'High',
              type: 'D',
              title: 'title',
              description: 'description',
              mitigation: 'mitigation',
              owner: '0',
            },
          },
          'component-2': {
            'threat-2': {
              id: '0',
              severity: 'High',
              type: 'D',
              title: 'title',
              description: 'description',
              mitigation: 'mitigation',
              owner: '0',
            },
          },
          'component-3': {
            'threat-3': {
              id: '0',
              severity: 'High',
              type: 'D',
              title: 'title',
              description: 'description',
              mitigation: 'mitigation',
              owner: '0',
            },
          },
        },
      },
    },
  };

  const metadata = {
    players: {
      0: { name: 'P1', credentials: 'abc123' },
      1: { name: 'P2', credentials: '123abc' },
    },
  };

  const model = {
    summary: {
      title: 'Foo',
    },
    detail: {
      diagrams: [
        {
          diagramJson: {
            cells: [
              {
                id: 'component-1',
                threats: [],
              },
              {
                id: 'component-2',
              },
            ],
          },
        },
      ],
    },
  };

  await gameServer.db.setMetadata(matchID, metadata);
  await gameServer.db.setModel(matchID, model);
  await gameServer.db.setState(matchID, state);

  // retrieve the model
  const response = await request(publicApiServer.callback())
    .get(`/game/${matchID}/download`)
    .auth('0', 'abc123');
  const threats = response.body.detail.diagrams[0].diagramJson.cells[0].threats;
  expect(threats[0].id).toBe('0');
  expect(threats[0].type).toBe('Spoofing');
  expect(threats[0].title).toBe('title');
  expect(threats[0].description).toBe('description');
  expect(threats[0].mitigation).toBe('mitigation');
  expect(threats[0].game).toBe(matchID);
});

it('Download threat file', async () => {
  const matchID = '1234567';

  const state = {
    G: {
      modelType: ModelType.THREAT_DRAGON,
      gameMode: GameMode.EOP,
      identifiedThreats: {
        0: {
          'component-1': {
            'threat-1': {
              id: '0',
              severity: 'High',
              type: 'D',
              title: 'title',
              description:
                '<img src="" onerror="alert(\'XSS\') alt="Uh oh...">',
              mitigation: 'mitigation',
              owner: '0',
            },
          },
          'component-2': {
            'threat-2': {
              id: '0',
              severity: 'High',
              type: 'D',
              title: 'title ',
              description: 'description',
              mitigation: 'mitigation',
              owner: '0',
            },
          },
          'component-3': {
            'threat-3': {
              id: '0',
              severity: 'High',
              type: 'D',
              title: 'title',
              description: 'description',
              mitigation: 'mitigation',
              owner: '0',
            },
          },
        },
      },
    },
  };

  //Maybe I should put these jsons into a file
  const model = {
    summary: {
      title: '  Demo Threat Model ',
    },
    detail: {
      diagrams: [
        {
          diagramJson: {
            cells: [
              {
                threats: [
                  {
                    status: 'Open',
                    severity: 'High',
                    mitigation: "[Click Me](javascript:alert('XSS'))",
                    description:
                      'The Background Worker configuration stores the credentials used by the worker to access the DB. An attacker could compromise the Background Worker and get access to the DB credentials.',
                    title: '    Accessing DB credentials ',
                    type: 'Information disclosure',
                  },
                ],
                hasOpenThreats: true,
              },
              {
                threats: [
                  {
                    status: 'Mitigated',
                    severity: 'High',
                    description:
                      'An attacker could make an query call on the DB,',
                    title: 'Unauthorised access ',
                    type: 'Information disclosure',
                    mitigation: 'Require all queries to be authenticated.',
                  },
                  {
                    status: 'Open',
                    severity: 'Medium',
                    description:
                      'An attacker could obtain the DB credentials ans use them to make unauthorised queries.',
                    title: 'Credential theft',
                    type: 'Information disclosure',
                    mitigation:
                      'Use a firewall to restrict access to the DB to only the Background Worker IP address.',
                    owner: 'The Model',
                  },
                ],
                hasOpenThreats: true,
              },
              {
                threats: [
                  {
                    status: 'Open',
                    severity: 'High',
                    title:
                      '![Uh oh...](https://www.example.com/image.png"onload="alert(\'XSS\'))',
                    type: 'Information disclosure',
                    description:
                      'The Web Application Config stores credentials used  by the Web App to access the message queue.\r\n\r\nThese could be stolen by an attacker and used to read confidential data or place poison message on the queue.',
                    mitigation:
                      "The Message Queue credentials should be encrypted.\n\n\n\n\nnewlines shouldn't\nbreak the formatting",
                  },
                ],
                hasOpenThreats: false,
              },
              {
                hasOpenThreats: false,
              },
              {
                hasOpenThreats: true,
              },
              {},
            ],
          },
        },
      ],
    },
  };

  const metadata = {
    players: {
      0: {
        id: 0,
        credentials: '30d1cdc1-110c-46f7-8178-e3fedcc71e3d',
        name: 'Player 1',
      },
      1: {
        id: 1,
        credentials: '7f76dc60-665a-4068-b3de-0ab7b00fcb6f',
        name: 'Player 2',
      },
    },
  };

  await gameServer.db.setState(matchID, state);
  await gameServer.db.setMetadata(matchID, metadata);
  await gameServer.db.setModel(matchID, model);

  const date = new Date().toLocaleString();

  // retrieve the model
  const response = await request(publicApiServer.callback())
    .get(`/game/${matchID}/download/text`)
    .auth('0', '30d1cdc1-110c-46f7-8178-e3fedcc71e3d');
  expect(response.text).toBe(`Threats ${date}
=======

1. **title**
    - *Severity:* High
    - *Author:* Player 1
    - *Description:* &lt;img src="" onerror="alert\\('XSS'\\) alt="Uh oh..."&gt;
    - *Mitigation:* mitigation
2. **title**
    - *Severity:* High
    - *Author:* Player 1
    - *Description:* description
    - *Mitigation:* mitigation
3. **title**
    - *Severity:* High
    - *Author:* Player 1
    - *Description:* description
    - *Mitigation:* mitigation
4. **Accessing DB credentials**
    - *Severity:* High
    - *Description:* The Background Worker configuration stores the credentials used by the worker to access the DB. An attacker could compromise the Background Worker and get access to the DB credentials.
    - *Mitigation:* \\[Click Me\\]\\(javascript:alert\\('XSS'\\)\\)
5. **Unauthorised access**
    - *Severity:* High
    - *Description:* An attacker could make an query call on the DB,
    - *Mitigation:* Require all queries to be authenticated.
6. **Credential theft**
    - *Severity:* Medium
    - *Author:* The Model
    - *Description:* An attacker could obtain the DB credentials ans use them to make unauthorised queries.
    - *Mitigation:* Use a firewall to restrict access to the DB to only the Background Worker IP address.
7. **\\!\\[Uh oh...\\]\\(https://www.example.com/image.png"onload="alert\\('XSS'\\)\\)**
    - *Severity:* High
    - *Description:* The Web Application Config stores credentials used  by the Web App to access the message queue. These could be stolen by an attacker and used to read confidential data or place poison message on the queue.
    - *Mitigation:* The Message Queue credentials should be encrypted. newlines shouldn't break the formatting
`);
});

describe('authentificaton', () => {
  const endpoints = ['players', 'model', 'download', 'download/text'];
  let matchID = null;
  let credentials = null;
  let spectatorCredential = null;

  beforeAll(async () => {
    // first create game
    const players = 3;

    let response = await request(publicApiServer.callback())
      .post('/game/create')
      .field('players', players)
      .field('names[]', ['P1', 'P2', 'P3'])
      .field('modelType', ModelType.DEFAULT);

    expect(response.body.game).toBeDefined();
    expect(response.body.credentials.length).toBe(players);

    matchID = response.body.game;
    credentials = response.body.credentials;
    spectatorCredential = response.body.spectatorCredential;
  });

  it.each(endpoints)(
    'returns an error if no authentication is provided to %s',
    async (endpoint) => {
      // Try players

      let response = await request(publicApiServer.callback()).get(
        `/game/${matchID}/${endpoint}`,
      );
      expect(response.status).toBe(403);
    },
  );

  it.each(endpoints)(
    'returns an error if no secret is provided to %s',
    async (endpoint) => {
      // Try players

      let response = await request(publicApiServer.callback())
        .get(`/game/${matchID}/${endpoint}`)
        .auth('0', '');
      expect(response.status).toBe(403);
    },
  );

  it.each(endpoints)(
    'returns an error if no userID is provided to %s',
    async (endpoint) => {
      // Try players

      let response = await request(publicApiServer.callback())
        .get(`/game/${matchID}/${endpoint}`)
        .auth('', credentials[0]);
      expect(response.status).toBe(403);
    },
  );

  it.each(endpoints)(
    'returns an error if wrong secret is provided to %s',
    async (endpoint) => {
      // Try players

      let response = await request(publicApiServer.callback())
        .get(`/game/${matchID}/${endpoint}`)
        .auth(0, 'thisiswrong');
      expect(response.status).toBe(403);
    },
  );

  it.each(endpoints)(
    'returns an error if Authorization header is incorrectly provided to %s',
    async (endpoint) => {
      // Try players

      let response = await request(publicApiServer.callback())
        .get(`/game/${matchID}/${endpoint}`)
        .set(
          'Authorization',
          // missing 'Basic ' prefix
          Buffer.from(`0:${credentials[0]}`).toString('base64'),
        );
      expect(response.status).toBe(403);
    },
  );

  it.each(endpoints)(
    'is successful for correct credentials provided to %s',
    async (endpoint) => {
      // Try players

      let response = await request(publicApiServer.callback())
        .get(`/game/${matchID}/${endpoint}`)
        .set(
          'Authorization',
          'Basic ' + Buffer.from(`0:${credentials[0]}`).toString('base64'),
        );
      expect(response.status).not.toBe(403);
    },
  );

  it.each(endpoints)(
    'is successful for correct spectator credentials provided to %s',
    async (endpoint) => {
      let response = await request(publicApiServer.callback())
        .get(`/game/${matchID}/${endpoint}`)
        .set(
          'Authorization',
          'Basic ' +
            Buffer.from(`${SPECTATOR}:${spectatorCredential}`).toString(
              'base64',
            ),
        );
      expect(response.status).not.toBe(403);
    },
  );

  it.each(endpoints)(
    'rejects wrong spectator credentials provided to %s',
    async (endpoint) => {
      let response = await request(publicApiServer.callback())
        .get(`/game/${matchID}/${endpoint}`)
        .set(
          'Authorization',
          'Basic ' +
            Buffer.from(`${SPECTATOR}:wrongCredentials`).toString('base64'),
        );
      expect(response.status).toBe(403);
    },
  );
});

afterAll(() => {
  // cleanup
  gameServerHandle.then((s) => {
    s.apiServer.close();
    s.appServer.close();
  });
  publicApiServerHandle.close();
});
