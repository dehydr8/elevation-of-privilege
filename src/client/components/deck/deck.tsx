import type React from 'react';
import { getValidMoves } from '../../../utils/utils';
import { GameMode, getCardCssClass } from '../../../utils/GameMode';
import type { Card, Suit } from '../../../utils/cardDefinitions';

interface DeckProps {
  suit: Suit;
  cards: Card[];
  isInThreatStage: boolean;
  round: number;
  current: boolean;
  active: boolean;
  onCardSelect: (e: Card) => void;
  startingCard: Card;
  gameMode: GameMode;
}

const Deck: React.FC<DeckProps> = ({
  suit,
  cards,
  isInThreatStage = false,
  round,
  current,
  active,
  onCardSelect,
  startingCard,
  gameMode,
}) => {
  const validMoves: Card[] =
    current && active && !isInThreatStage
      ? getValidMoves(cards, suit, round, startingCard)
      : [];

  const roundedClass =
    gameMode === GameMode.CUMULUS ? `card-rounded-cumulus` : `card-rounded`;

  return (
    <div className="playingCards">
      <ul className="hand">
        {cards.map((card) => (
          <li
            key={`card-in-hand-${card}`}
            className={`playing-card ${getCardCssClass(gameMode, card)} ${
              validMoves.includes(card) ? 'active' : ''
            } ${roundedClass} scaled`}
            onClick={() => onCardSelect(card)}
          />
        ))}
      </ul>
    </div>
  );
};

export default Deck;
