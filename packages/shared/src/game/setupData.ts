import type { Suit } from '../utils/cardDefinitions';
import type { ModelType } from '../utils/constants';
import type { GameMode } from '../utils/GameMode';

export interface SetupData {
  startSuit: Suit;
  gameMode: GameMode;
  modelType: ModelType;
  turnDuration: number;
  spectatorCredential: string;
  modelReference?: string;
}
