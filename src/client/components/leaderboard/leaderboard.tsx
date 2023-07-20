import type { PlayerID } from 'boardgame.io';
import React from 'react';
import type { FC } from 'react';
import { Badge, Card, CardHeader, Table } from 'reactstrap';
import {
  getCardDisplayName,
  Card as EOPCard,
} from '../../../utils/cardDefinitions';
import type { GameMode } from '../../../utils/GameMode';
import './leaderboard.css';

type LeaderboardProps = {
  scores: Array<number>;
  names: Array<string>;
  cards: Array<EOPCard>;
  playerID: PlayerID;
  passedUsers: Array<PlayerID>;
  gameMode: GameMode;
};

const Leaderboard: FC<LeaderboardProps> = ({
  scores,
  names,
  cards,
  playerID,
  passedUsers,
  gameMode,
}) => {
  const hasPassed = (_idx: number) => {
    return passedUsers.includes(_idx.toString());
  };

  return (
    <Card>
      <CardHeader>Statistics</CardHeader>
      <Table size="sm">
        <thead>
          <tr>
            <th>Name</th>
            <th>Passed</th>
            <th>Card</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          {scores.map((val, idx) => (
            <tr key={idx}>
              <td>
                <div className="player-name">{names[idx]}</div>
                {parseInt(playerID) === idx && (
                  <div>
                    <strong>(you)</strong>
                  </div>
                )}
              </td>
              <td>
                {hasPassed(idx) && <div className="check-mark">&#10003;</div>}
              </td>
              <td>
                <strong>{getCardDisplayName(gameMode, cards[idx])}</strong>
              </td>
              <td>
                <Badge>{val}</Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Card>
  );
};

export default Leaderboard;
