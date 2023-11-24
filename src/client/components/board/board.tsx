import type { BoardProps as BoardgameIOBoardProps } from 'boardgame.io/react';
import React, { FC, useCallback, useEffect, useState } from 'react';
import Model from '../model/model';
import Deck from '../deck/deck';
import Sidebar from '../sidebar/sidebar';
import Threatbar from '../threatbar/threatbar';
import ImageModel from '../imagemodel/imagemodel';
import Timer from '../timer/timer';
import './board.css';
import request from 'superagent';
import Status from '../status/status';
import { getDealtCard } from '../../../utils/utils';
import { ModelType, SPECTATOR } from '../../../utils/constants';
import LicenseAttribution from '../license/licenseAttribution';
import { API_PORT } from '../../../utils/serverConfig';
import PrivacyEnhancedModel from '../privacyEnhancedModel/privacyEnhancedModel';
import Imprint from '../footer/imprint';
import Privacy from '../footer/privacy';
import Banner from '../banner/banner';
import type { GameState } from '../../../game/gameState';

type BoardProps = Pick<
  BoardgameIOBoardProps<GameState>,
  'G' | 'ctx' | 'matchID' | 'moves' | 'playerID' | 'credentials'
>;

const Board: FC<BoardProps> = ({
  G,
  ctx,
  matchID,
  moves,
  playerID,
  credentials,
}) => {
  const initialNames = Array.from<string>({
    length: ctx.numPlayers,
  }).fill('No Name');

  const [names, setNames] = useState(initialNames);

  const [model, setModel] = useState<Record<string, unknown> | undefined>(
    undefined,
  );
  const apiBase =
    process.env.NODE_ENV === 'production'
      ? '/api'
      : `${window.location.protocol}//${window.location.hostname}:${API_PORT}`;

  const updateName = useCallback(
    (index: number, name: string) => {
      setNames([...names].splice(index, 1, name));
    },
    [setNames, names],
  );

  const apiGetRequest = useCallback(
    async (endpoint: string) => {
      // Using superagent makes auth easier but for consistency using fetch may be better
      if (credentials !== undefined) {
        try {
          return await request
            .get(`${apiBase}/game/${matchID}/${endpoint}`)
            .auth(playerID ?? SPECTATOR, credentials);
        } catch (err) {
          console.error(err);
        }
      } else {
        console.error('Credentials are missing.');
      }
    },
    [apiBase, matchID, playerID, credentials],
  );

  const updateNames = useCallback(async () => {
    // TODO: Type with zod and consider using react-query.
    const playersResponse = await apiGetRequest('players');
    for (const player of playersResponse?.body.players ?? []) {
      if (typeof player.name !== 'undefined') {
        updateName(player.id, player.name);
      }
    }
  }, [apiGetRequest, updateName]);

  const updateModel = useCallback(async () => {
    // TODO: Type with zod and consider using react-query.
    const modelResponse = await apiGetRequest('model');

    const model = modelResponse?.body as Record<string, unknown> | undefined;

    setModel(model);
  }, [apiGetRequest, setModel]);

  // consider using react-query instead
  useEffect(() => {
    updateNames();
    if (G.modelType !== ModelType.IMAGE) {
      updateModel();
    }
  }, [updateNames, G.modelType, updateModel]);

  const current = playerID === ctx.currentPlayer;

  const isInThreatStage =
    !!ctx.activePlayers &&
    !!playerID &&
    ctx.activePlayers?.[playerID] === 'threats';

  const isSpectator = !playerID;
  const isFirstPlayerInThreatStage = ctx.activePlayers?.[0] === 'threats';

  const shouldShowTimer =
    isInThreatStage || (isSpectator && isFirstPlayerInThreatStage);
  const active = current || isInThreatStage;

  const dealtCard = getDealtCard(G);

  if (credentials === undefined) {
    return (
      <div>
        <Banner />
        <p>Credentials are missing.</p>
      </div>
    );
  }

  return (
    <div>
      <Banner />

      {G.modelType === ModelType.IMAGE && (
        <ImageModel
          playerID={playerID ?? SPECTATOR}
          credentials={credentials}
          matchID={matchID}
        />
      )}
      {G.modelType === ModelType.THREAT_DRAGON && (
        <Model
          model={model}
          selectedDiagram={G.selectedDiagram}
          selectedComponent={G.selectedComponent}
          onSelectDiagram={moves.selectDiagram}
          onSelectComponent={moves.selectComponent}
        />
      )}
      {G.modelType === ModelType.PRIVACY_ENHANCED && (
        <PrivacyEnhancedModel modelReference={G.modelReference} />
      )}
      <div className="player-wrap">
        <div className="playingCardsContainer">
          <div className="status-bar">
            <Status
              G={G}
              ctx={ctx}
              gameMode={G.gameMode}
              playerID={playerID}
              names={names}
              current={current}
              active={active}
              dealtCard={dealtCard}
              isInThreatStage={isInThreatStage}
            />
          </div>
          {playerID && G.suit && (
            <Deck
              cards={G.players[Number.parseInt(playerID)]}
              suit={G.suit}
              /* phase replaced with isInThreatStage. active players is null when not */
              isInThreatStage={isInThreatStage}
              round={G.round}
              current={current}
              active={active}
              onCardSelect={(e) => moves.draw(e)}
              startingCard={G.startingCard} // <===  This is still missing   i.e. undeifned
              gameMode={G.gameMode}
            />
          )}
        </div>
        <div className="board-footer">
          <Imprint />
          <Privacy />
        </div>
        <LicenseAttribution gameMode={G.gameMode} />
      </div>
      <Sidebar
        G={G}
        ctx={ctx}
        playerID={playerID ?? SPECTATOR}
        matchID={matchID}
        moves={moves}
        isInThreatStage={isInThreatStage}
        current={current}
        active={active}
        names={names}
        secret={credentials}
      />
      <Timer
        active={shouldShowTimer}
        targetTime={G.turnFinishTargetTime ?? 0}
        duration={G.turnDuration}
      />
      <Threatbar
        G={G}
        ctx={ctx}
        playerID={playerID}
        model={model}
        names={names}
        moves={moves}
        active={active}
        isInThreatStage={isInThreatStage}
      />
    </div>
  );
};

export default Board;
