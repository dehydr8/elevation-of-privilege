import type { PlayerID } from 'boardgame.io';
import _ from 'lodash';
import React, { ChangeEvent } from 'react';
import Helmet from 'react-helmet';
import { Link } from 'react-router-dom';
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  Form,
  FormFeedback,
  FormGroup,
  FormText,
  Input,
  Label,
  Row,
  Table,
} from 'reactstrap';
import {
  getSuitDisplayName,
  getSuits,
  isSuitInDeck,
  Suit,
} from '../../utils/cardDefinitions';
import {
  API_PORT,
  DEFAULT_GAME_MODE,
  DEFAULT_START_SUIT,
  DEFAULT_TURN_DURATION,
  GameMode,
  isGameMode,
  MAX_NUMBER_PLAYERS,
  MIN_NUMBER_PLAYERS,
  ModelType,
  SPECTATOR,
} from '../../utils/constants';
import { isModelType } from '../../utils/utils';
import CopyButton from '../components/copybutton/copybutton';
import Footer from '../components/footer/footer';
import Logo from '../components/logo/logo';
import '../styles/create.css';

type CreateProps = Record<string, never>;

interface CreateState {
  players: number;
  matchID: string;
  names: Record<PlayerID, string>;
  secret: Record<PlayerID, string>;
  spectatorSecret: string;
  creating: boolean;
  created: boolean;
  modelType: ModelType;
  model: Record<string, unknown> | undefined;
  image: File | undefined;
  startSuit: Suit;
  turnDuration: number;
  provideModelThruAlternativeChannel: boolean;
  gameMode: GameMode;
}

class Create extends React.Component<CreateProps, CreateState> {
  fileReader: FileReader;
  apiBase: string;

  constructor(props: CreateProps) {
    super(props);
    const initialPlayerNames: Record<number, string> = {};
    const initialSecrets: Record<number, string> = {};
    _.range(MAX_NUMBER_PLAYERS).forEach((n) => {
      initialPlayerNames[n] = `Player ${n + 1}`;
      initialSecrets[n] = ``;
    });

    this.state = {
      players: 3,
      matchID: '',
      names: initialPlayerNames,
      secret: initialSecrets,
      spectatorSecret: ``,
      creating: false,
      created: false,
      modelType: ModelType.DEFAULT,
      model: undefined,
      image: undefined,
      startSuit: DEFAULT_START_SUIT,
      turnDuration: DEFAULT_TURN_DURATION,
      provideModelThruAlternativeChannel: false,
      gameMode: DEFAULT_GAME_MODE,
    };

    this.onPlayersUpdated = this.onPlayersUpdated.bind(this);
    this.onNameUpdated = this.onNameUpdated.bind(this);
    this.onStartSuitUpdated = this.onStartSuitUpdated.bind(this);
    this.onTurnDurationUpdated = this.onTurnDurationUpdated.bind(this);
    this.onGameModeUpdated = this.onGameModeUpdated.bind(this);
    this.readJson = this.readJson.bind(this);
    this.updateImage = this.updateImage.bind(this);
    this.onFileRead = this.onFileRead.bind(this);
    this.createGame = this.createGame.bind(this);
    this.updateModelType = this.updateModelType.bind(this);
    this.formatAllLinks = this.formatAllLinks.bind(this);
    this.url = this.url.bind(this);

    this.fileReader = new FileReader();
    this.fileReader.onloadend = this.onFileRead;

    this.apiBase =
      process.env.NODE_ENV === 'production'
        ? '/api'
        : `${window.location.protocol}//${window.location.hostname}:${API_PORT}`;
  }

  async createGame(): Promise<void> {
    this.setState({
      ...this.state,
      creating: true,
    });
    // FormData object (with file if required)
    const formData = new FormData();

    formData.append('players', `${this.state.players}`);
    formData.append('modelType', this.state.modelType);
    if (this.state.modelType !== ModelType.DEFAULT) {
      formData.append(
        'model',
        this.state.modelType === ModelType.IMAGE
          ? this.state.image ?? ''
          : JSON.stringify(this.state.model),
      );
    }
    for (let i = 0; i < this.state.players; i++) {
      formData.append('names[]', this.state.names[`${i}`]);
    }
    formData.append('startSuit', this.state.startSuit);
    formData.append('turnDuration', `${this.state.turnDuration}`);
    formData.append('gameMode', this.state.gameMode);

    // Use Fetch API (not superagent)
    const response = await fetch(`${this.apiBase}/game/create`, {
      method: 'POST',
      body: formData,
    });

    // deal with response
    const r = await response.json();

    const gameId = r.game;

    for (let i = 0; i < r.credentials.length; i++) {
      this.setState({
        ...this.state,
        secret: {
          ...this.state.secret,
          [i]: r.credentials[i],
        },
      });
    }

    this.setState({
      spectatorSecret: r.spectatorCredential,
    });

    this.setState({
      ...this.state,
      matchID: gameId,
      created: true,
    });
  }

  onFileRead(): void {
    if (typeof this.fileReader.result !== 'string') {
      throw new Error(
        "Expected `fileReader.result` to be a string but it wasn't.",
      );
    }
    const model = JSON.parse(this.fileReader.result);
    this.setState({
      ...this.state,
      model,
    });
  }

  readJson(e: ChangeEvent<HTMLInputElement>): void {
    const file = e.target.files?.[0];
    if (!file) {
      throw new Error(
        'Expected change event to target an input element with a file but there was no file attached.',
      );
    }
    this.fileReader.readAsText(file);
  }

  updateImage(e: ChangeEvent<HTMLInputElement>): void {
    this.setState({
      ...this.state,
      image: e.target.files?.[0],
    });
  }

  onPlayersUpdated(e: ChangeEvent<HTMLInputElement>): void {
    this.setState({
      ...this.state,
      players: parseInt(e.target.value),
    });
  }

  onStartSuitUpdated(e: ChangeEvent<HTMLInputElement>): void {
    const startSuit = e.target.value as Suit;
    const gameMode = this.state.gameMode;
    if (!isSuitInDeck(startSuit, gameMode)) {
      throw new Error(`Invalid start suit '${startSuit}'`);
    }
    this.setState({
      ...this.state,
      startSuit,
    });
  }

  onGameModeUpdated(e: ChangeEvent<HTMLInputElement>): void {
    const gameMode = e.target.value;
    if (!isGameMode(gameMode)) {
      throw new Error(`Invalid game mode '${gameMode}'`);
    }
    this.setState({
      ...this.state,
      gameMode,
    });
  }

  onNameUpdated(idx: number, e: ChangeEvent<HTMLInputElement>): void {
    this.setState({
      ...this.state,
      names: {
        ...this.state.names,
        [idx]: e.target.value,
      },
    });
  }

  onTurnDurationUpdated(e: ChangeEvent<HTMLInputElement>): void {
    this.setState({
      ...this.state,
      turnDuration: Number.parseInt(e.target.value),
    });
  }

  isFormValid(): boolean {
    for (let i = 0; i < this.state.players; i++) {
      if (_.isEmpty(this.state.names[`${i}`])) {
        return false;
      }
    }
    if (
      (this.state.modelType === ModelType.THREAT_DRAGON && !this.state.model) ||
      (this.state.modelType === ModelType.IMAGE && !this.state.image)
    ) {
      return false;
    }
    return true;
  }

  updateModelType(e: ChangeEvent<HTMLInputElement>): void {
    const modelType = e.target.value;
    if (!isModelType(modelType)) {
      throw new Error(`Invalid model type ${modelType}`);
    }
    this.setState({
      ...this.setState,
      modelType,
    });
  }

  url(playerId: PlayerID): string {
    const secret =
      playerId === SPECTATOR
        ? this.state.spectatorSecret
        : this.state.secret[playerId];
    return `${window.location.origin}/${this.state.matchID}/${playerId}/${secret}`;
  }

  formatAllLinks(): string {
    return (
      'You have been invited to a game of Elevation of Privilege:\n\n' +
      Array(this.state.players)
        .fill(0)
        .map((_, i) => {
          return `${this.state.names[i]}:\t${this.url(`${i}`)}`;
        })
        .join('\n\n')
    );
  }

  render(): JSX.Element {
    let createForm = <div />;
    let linkDisplay = <div />;
    if (!this.state.created) {
      createForm = (
        <div>
          <p>
            Elevation of Privilege (EoP) is the easy way to get started and
            learn threat modeling. It is a card game that developers, architects
            or security experts can play.
          </p>
          <p>
            To learn more about the game, navigate to the{' '}
            <Link to="/about">about page</Link>.
          </p>
          <small className="text-muted">
            To start playing, select the number of players and enter their
            names.
          </small>
          <hr />
          <Form>
            <FormGroup row>
              <Label for="players" sm={2}>
                Players
              </Label>
              <Col sm={10}>
                <Input
                  type="select"
                  name="players"
                  id="players"
                  onChange={(e) => this.onPlayersUpdated(e)}
                  value={this.state.players}
                >
                  {_.range(MIN_NUMBER_PLAYERS, MAX_NUMBER_PLAYERS + 1).map(
                    (n) => (
                      <option key={`players-${n}`} value={n}>
                        {n}
                      </option>
                    ),
                  )}
                </Input>
              </Col>
            </FormGroup>
            <hr />
            {Array(this.state.players)
              .fill(0)
              .map((v, i) => (
                <FormGroup row key={i}>
                  <Label for={`p${i}`} sm={2}>
                    Name
                  </Label>
                  <Col sm={10}>
                    <Input
                      autoComplete={'off'}
                      type="text"
                      invalid={_.isEmpty(this.state.names[i])}
                      name={`p${i}`}
                      id={`p${i}`}
                      onChange={(e) => this.onNameUpdated(i, e)}
                      value={this.state.names[i]}
                    />
                    <FormFeedback>The name cannot be empty</FormFeedback>
                  </Col>
                </FormGroup>
              ))}
            <hr />
            <FormGroup row>
              <Label for="gameMode" sm={2}>
                Game Mode
              </Label>
              <Col sm={10}>
                <Input
                  id="gameMode"
                  type="select"
                  onChange={(e) => this.onGameModeUpdated(e)}
                  value={this.state.gameMode}
                >
                  <option>{GameMode.EOP}</option>
                  <option>{GameMode.CORNUCOPIA}</option>
                </Input>
              </Col>
            </FormGroup>
            <FormGroup row>
              <Label for="startSuit" sm={2}>
                Start Suit
              </Label>
              <Col sm={10}>
                <Input
                  type="select"
                  name="startSuit"
                  id="startSuit"
                  onChange={(e) => this.onStartSuitUpdated(e)}
                  value={this.state.startSuit}
                >
                  {getSuits(this.state.gameMode).map((suit) => (
                    <option value={suit} key={`start-suit-option-${suit}`}>
                      {getSuitDisplayName(this.state.gameMode, suit)}
                    </option>
                  ))}
                </Input>
              </Col>
            </FormGroup>
            <hr />
            <FormGroup row>
              <Label for="turnDuration" sm={2}>
                Turn Duration
              </Label>
              <Col sm={10}>
                <Input
                  type="select"
                  name="turnDuration"
                  id="turnDuration"
                  onChange={(e) => this.onTurnDurationUpdated(e)}
                  value={this.state.turnDuration}
                >
                  <option value={0}>No Timer</option>
                  <option value={180}>3 mins</option>
                  <option value={300}>5 mins</option>
                  <option value={600}>10 mins</option>
                </Input>
              </Col>
            </FormGroup>
            <hr />
            <FormGroup row>
              <Label for="model" sm={2}>
                Model
              </Label>
              <Col sm={10}>
                <FormGroup>
                  <Label check>
                    <Input
                      type="radio"
                      name="model-type"
                      value={ModelType.THREAT_DRAGON}
                      onChange={this.updateModelType}
                    />
                    Provide model via Threat Dragon
                  </Label>
                  <Input
                    disabled={this.state.modelType !== ModelType.THREAT_DRAGON}
                    type="file"
                    name="model-json"
                    id="model"
                    onChange={this.readJson}
                    checked={this.state.modelType === ModelType.THREAT_DRAGON}
                  />
                  <FormText color="muted">
                    Select the JSON model produced by{' '}
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      href="https://docs.threatdragon.org/"
                    >
                      Threat Dragon
                    </a>
                    .
                  </FormText>
                  <FormText color="muted">
                    Or download a{' '}
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      href="https://raw.githubusercontent.com/mike-goodwin/owasp-threat-dragon-demo/master/ThreatDragonModels/Demo%20Threat%20Model/Demo%20Threat%20Model.json"
                    >
                      sample model
                    </a>{' '}
                    to try it out.
                  </FormText>
                </FormGroup>
                <FormGroup>
                  <Label check>
                    <Input
                      type="radio"
                      name="model-type"
                      value={ModelType.IMAGE}
                      onChange={this.updateModelType}
                    />
                    Provide Model via an image
                  </Label>
                  <Input
                    disabled={this.state.modelType !== ModelType.IMAGE}
                    type="file"
                    accept="image/*"
                    name="model-image"
                    id="model"
                    onChange={this.updateImage}
                    checked={this.state.modelType === ModelType.IMAGE}
                  />
                </FormGroup>
                <FormGroup>
                  <Label check>
                    <Input
                      id="radio-button-default-model"
                      type="radio"
                      value={ModelType.DEFAULT}
                      name="model-type"
                      onChange={this.updateModelType}
                      checked={this.state.modelType === ModelType.DEFAULT}
                    />
                    Provide model via a different channel (e.g. video stream)
                  </Label>
                </FormGroup>
              </Col>
            </FormGroup>
            <hr />
            <Button
              block
              size="lg"
              color="warning"
              disabled={this.state.creating || !this.isFormValid()}
              onClick={this.createGame}
            >
              Proceed
            </Button>
          </Form>
          <hr />
          <small className="text-muted">
            Players will be able to join the game with the links that are
            generated after you proceed.
          </small>
        </div>
      );
    } else {
      linkDisplay = (
        <div>
          <div className="text-center text-muted">
            <p>
              The following links should be distributed to the players
              respectively.
            </p>
          </div>
          <Table>
            <tbody>
              {Array(this.state.players)
                .fill(0)
                .map((v, i) => (
                  <tr key={i}>
                    <td className="c-td-name">{this.state.names[i]}</td>
                    <td>
                      <a
                        href={`${this.url(`${i}`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {this.url(`${i}`)}
                      </a>
                    </td>
                    <td>
                      <CopyButton text={this.url(`${i}`)} />
                    </td>
                  </tr>
                ))}
              <tr key="spectator" className="spectator-row">
                <td className="c-td-name">Spectator</td>
                <td>
                  <a
                    href={`${this.url(SPECTATOR)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {this.url(SPECTATOR)}
                  </a>
                </td>
                <td>
                  <CopyButton text={this.url(SPECTATOR)} />
                </td>
              </tr>
            </tbody>
          </Table>
          <hr />
          <CopyButton
            text={this.formatAllLinks()}
            color="warning"
            block
            size="lg"
          >
            Copy All
          </CopyButton>
          <hr />
          <div className="text-center">
            <small className="text-muted">
              These links are unique for each player and would allow them to
              join the game.
            </small>
          </div>
        </div>
      );
    }

    return (
      <div>
        {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
        <Helmet bodyAttributes={{ style: 'background-color : #000' }} />
        <Container className="create">
          <Row style={{ paddingTop: '20px' }}>
            <Col sm="12" md={{ size: 6, offset: 3 }}>
              <div className="text-center">
                <Logo />
              </div>
              <Card>
                <CardHeader className="text-center">
                  Elevation of Privilege
                </CardHeader>
                <CardBody>
                  {createForm}
                  {linkDisplay}
                </CardBody>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col sm="12" md={{ size: 6, offset: 3 }} className="text-center">
              <Footer />
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}
export default Create;
