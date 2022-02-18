import type { Suit } from '../utils/cardDefinitions';
import type { GameMode, ModelType } from '../utils/constants';

export interface SetupData {
  startSuit: Suit;
  gameMode: GameMode;
  modelType: ModelType;
  turnDuration: number;
  spectatorCredential: string;
}
