import type { PlayerID } from 'boardgame.io';
import type { DeckSuit, GameMode, ModelType } from '../utils/constants';
import type { Threat } from './threat';

export interface EOPGameState {
  dealt: string[];
  passed: PlayerID[];
  suit: DeckSuit | '';
  dealtBy: PlayerID;
  players: string[][];
  round: number;
  numCardsPlayed: number;
  scores: number[];
  lastWinner: number;
  maxRounds: number;
  selectedDiagram: number;
  selectedComponent: string;
  selectedThreat: string;
  threat: Threat;
  identifiedThreats: Record<PlayerID, Record<string, Record<string, Threat>>>;
  startingCard: string;
  gameMode: GameMode;
  turnDuration: number;
  modelType: ModelType;
  turnFinishTargetTime?: number;
}
