import {
  getCardDisplayName,
  getPlayers,
  grammarJoin,
  resolvePlayerName,
  resolvePlayerNames,
} from '@eop/shared';
import React from 'react';

import './status.css';

import type { GameState } from '@eop/shared';
import type { Ctx, PlayerID } from 'boardgame.io';
import type { FC } from 'react';

type StatusProps = {
  playerID: PlayerID | null;
  G: GameState;
  ctx: Ctx;
  names: string[];
  dealtCard: string;
  isInThreatStage: boolean;
};

const Status: FC<StatusProps> = ({
  playerID,
  ctx,
  names,
  isInThreatStage = false,
  dealtCard,
  G,
}) => {
  const isSpectator = playerID !== null;
  const isFirstPlayerInThreatStage = ctx.activePlayers?.[0] === 'threats';
  if (!(isInThreatStage || (isSpectator && isFirstPlayerInThreatStage))) {
    const currentPlayerName = resolvePlayerName(
      ctx.currentPlayer,
      names,
      playerID,
    );

    const prefix =
      dealtCard === '' && G.round > 1 ? (
        <>
          Last round won by{' '}
          <strong>
            {resolvePlayerName(G.lastWinner.toString(), names, playerID)}
          </strong>
          .{' '}
        </>
      ) : undefined;

    return (
      <span className="status">
        {prefix}Waiting for <strong>{currentPlayerName}</strong> to play a card.
      </span>
    );
  } else {
    const all = new Set(getPlayers(ctx.numPlayers));
    const passed = new Set(G.passed);
    const difference = new Set([...all].filter((x) => !passed.has(x)));
    const players = resolvePlayerNames(Array.from(difference), names, playerID);
    const playerWhoDealt = resolvePlayerName(G.dealtBy, names, playerID);

    return (
      <span className="status">
        <strong>{playerWhoDealt}</strong> dealt{' '}
        <strong>{getCardDisplayName(G.gameMode, dealtCard)}</strong>, waiting
        for <strong>{grammarJoin(players)}</strong> to add threats or pass.
      </span>
    );
  }
};

export default Status;
