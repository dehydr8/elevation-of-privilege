import React from 'react';
import type { FC } from 'react';
import Leaderboard from '../leaderboard/leaderboard';
import DealtCard from '../dealtcard/dealtcard';
import DownloadButton from '../downloadbutton/downloadbutton';
import './sidebar.css';
import { Button } from 'reactstrap';
import { getDealtCard } from '../../../utils/utils';
import Footer from '../footer/footer';
import { ModelType, SPECTATOR } from '../../../utils/constants';
import type { GameState } from '../../../game/gameState';
import type { BoardProps } from 'boardgame.io/react';

export type SidebarProps = Pick<
  BoardProps<GameState>,
  'G' | 'ctx' | 'matchID' | 'moves'
> & {
  playerID: string;
  isInThreatStage?: boolean;
  current: boolean;
  active: boolean;
  names: string[];
  secret: string;
};

const Sidebar: FC<SidebarProps> = ({
  G,
  ctx,
  playerID,
  matchID,
  moves,
  isInThreatStage = false,
  active,
  names,
  secret,
}) => {
  const dealtCard = getDealtCard(G);
  const isLastToPass =
    G.passed.length === ctx.numPlayers - 1 &&
    !G.passed.includes(playerID) &&
    playerID !== SPECTATOR;

  return (
    <div className="side-bar">
      <div className="text-center">
        <Footer short />
      </div>
      {G.modelType === ModelType.THREAT_DRAGON && (
        <DownloadButton
          matchID={matchID}
          playerID={playerID}
          secret={secret}
          block
          size="lg"
          color="success"
          apiEndpoint="download"
        >
          Download Model
        </DownloadButton>
      )}
      <DownloadButton
        matchID={matchID}
        playerID={playerID}
        secret={secret}
        block
        size="lg"
        color="warning"
        apiEndpoint="download/text"
      >
        Download Threats
      </DownloadButton>
      <hr />

      <Leaderboard
        gameMode={G.gameMode}
        passedUsers={G.passed}
        playerID={playerID}
        scores={G.scores}
        names={names}
        cards={G.dealt}
      />

      {isLastToPass && (
        <div className="warning">You are the last one to pass!</div>
      )}
      {isInThreatStage && !G.passed.includes(playerID) && active && (
        <Button
          color={isLastToPass ? 'warning' : 'secondary'}
          className="pass"
          size="lg"
          block
          onClick={() => moves.pass()}
        >
          Pass
        </Button>
      )}

      <DealtCard card={dealtCard} gameMode={G.gameMode} />
    </div>
  );
};

export default Sidebar;
