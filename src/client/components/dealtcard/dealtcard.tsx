import type React from 'react';
import { GameMode, getCardCssClass } from '../../../utils/GameMode';
import type { Card } from '../../../utils/cardDefinitions';

interface DealtCardProps {
  gameMode: GameMode;
  card: Card;
}

const DealtCard: React.FC<DealtCardProps> = ({ gameMode, card }) => {
  return (
    <div
      className={`playing-card ${getCardCssClass(
        gameMode,
        card,
      )} active card-rounded scaled-big`}
    />
  );
};

export default DealtCard;
