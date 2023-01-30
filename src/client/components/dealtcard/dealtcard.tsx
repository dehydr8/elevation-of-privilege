import type React from 'react';
import { GameMode, getCardCssClass } from '../../../utils/GameMode';
import type { Card } from '../../../utils/cardDefinitions';

interface DealtCardProps {
  gameMode: GameMode;
  card: Card;
}

const DealtCard: React.FC<DealtCardProps> = ({ gameMode, card }) => {
  const roundedClass =
    gameMode === GameMode.CUMULUS ? `card-rounded-cumulus` : `card-rounded`;
  return (
    <div
      className={`playing-card ${getCardCssClass(
        gameMode,
        card,
      )} active ${roundedClass} scaled-big`}
    />
  );
};

export default DealtCard;
