import _ from 'lodash';

export const DECK_HANDS = ['2','3','4','5','6','7','8','9','10','J','Q','K','A'];
export const DECK_SUITS = ['S','T','R','I','D','E'];
export const INVALID_CARDS = ['T2', 'E2', 'E3', 'E4'];
export const TRUMP_CARD_PREFIX = 'E';
export const DEFAULT_START_SUIT = 'T'
//TODO: Extract the following from INVALID_CARDS
export const STARTING_CARD_MAP = {
    'S': 'S2',
    'T': 'T3',
    'R': 'R2',
    'I': 'I2', 
    'D': 'D2',
    'E': 'E5'
  }

export const MIN_NUMBER_PLAYERS = 3;
export const MAX_NUMBER_PLAYERS = 9;

export const SERVER_PORT = process.env.SERVER_PORT || 8000;
export const API_PORT = process.env.API_PORT || 8001;
export const INTERNAL_API_PORT = process.env.INTERNAL_API_PORT || 8002;