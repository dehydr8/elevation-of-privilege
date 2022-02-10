import type { DeckSuit, GameMode, ModelType } from '../utils/constants';

export interface EOPSetupData {
  startSuit: DeckSuit;
  gameMode: GameMode;
  modelType: ModelType;
  turnDuration: number;
  spectatorCredential: string;
}
