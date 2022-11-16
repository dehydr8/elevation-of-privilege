import type { PlayerID } from 'boardgame.io';
import type { Suit } from '../utils/cardDefinitions';
import type { ModelType } from '../utils/constants';
import type { GameMode } from '../utils/GameMode';
import type { Threat } from './threat';

export interface GameState {
  dealt: string[];
  passed: PlayerID[];
  suit: Suit | undefined;
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
