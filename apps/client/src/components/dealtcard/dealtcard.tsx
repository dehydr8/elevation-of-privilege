import { GameMode, getCardCssClass } from '@eop/shared';
import type React from 'react';

import type { Card } from '@eop/shared';

interface DealtCardProps {
  gameMode: GameMode;
  card: Card;
}

const DealtCard: React.FC<DealtCardProps> = ({ gameMode, card }) => {
  const roundedClass =
    gameMode === GameMode.CUMULUS ? `card-rounded-cumulus` : `card-rounded`;
  const translationClass =
    gameMode === GameMode.EOMLSEC ? `card-translate-left` : ``;
  return (
    <div
      className={`playing-card ${getCardCssClass(
        gameMode,
        card,
      )} active ${roundedClass} scaled-big ${translationClass}`}
    />
  );
};

export default DealtCard;
