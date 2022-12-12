import { GameMode } from './GameMode';

export type Card = string;
export type Suit = 'A' | 'B' | 'C' | 'D' | 'E' | 'T';

interface SuitDetails {
  name?: string;
  abbreviation?: string;
  cards: Card[];
  isTrump: boolean;
  isDefault: boolean;
}

type CardDeckDefinitions = {
  [key in GameMode]: { [suit in Suit]: SuitDetails };
};

const CARD_DECKS: CardDeckDefinitions = {
  [GameMode.EOP]: {
    A: {
      name: 'Denial of Service',
      abbreviation: 'D',
      cards: [
        'A2',
        'A3',
        'A4',
        'A5',
        'A6',
        'A7',
        'A8',
        'A9',
        'A10',
        'AJ',
        'AQ',
        'AK',
        'AA',
      ],
      isTrump: false,
      isDefault: false,
    },
    B: {
      name: 'Information Disclosure',
      abbreviation: 'I',
      cards: [
        'B2',
        'B3',
        'B4',
        'B5',
        'B6',
        'B7',
        'B8',
        'B9',
        'B10',
        'BJ',
        'BQ',
        'BK',
        'BA',
      ],
      isTrump: false,
      isDefault: false,
    },
    C: {
      name: 'Repudiation',
      abbreviation: 'R',
      cards: [
        'C2',
        'C3',
        'C4',
        'C5',
        'C6',
        'C7',
        'C8',
        'C9',
        'C10',
        'CJ',
        'CQ',
        'CK',
        'CA',
      ],
      isTrump: false,
      isDefault: false,
    },
    D: {
      name: 'Spoofing',
      abbreviation: 'S',
      cards: [
        'D2',
        'D3',
        'D4',
        'D5',
        'D6',
        'D7',
        'D8',
        'D9',
        'D10',
        'DJ',
        'DQ',
        'DK',
        'DA',
      ],
      isTrump: false,
      isDefault: false,
    },
    E: {
      name: 'Tampering',
      abbreviation: 'T',
      cards: [
        'E2',
        'E3',
        'E4',
        'E5',
        'E6',
        'E7',
        'E8',
        'E9',
        'E10',
        'EJ',
        'EQ',
        'EK',
        'EA',
      ],
      isTrump: false,
      isDefault: true,
    },
    T: {
      name: 'Elevation of Privilege',
      abbreviation: 'E',
      cards: [
        'T2',
        'T3',
        'T4',
        'T5',
        'T6',
        'T7',
        'T8',
        'T9',
        'T10',
        'TJ',
        'TQ',
        'TK',
        'TA',
      ],
      isTrump: true,
      isDefault: false,
    },
  },
  [GameMode.CORNUCOPIA]: {
    A: {
      name: 'Data Validation & Encoding',
      abbreviation: 'Data',
      cards: [
        'A2',
        'A3',
        'A4',
        'A5',
        'A6',
        'A7',
        'A8',
        'A9',
        'A10',
        'AJ',
        'AQ',
        'AK',
        'AA',
      ],
      isTrump: false,
      isDefault: false,
    },
    B: {
      name: 'Cryptography',
      abbreviation: 'Crypt',
      cards: [
        'B2',
        'B3',
        'B4',
        'B5',
        'B6',
        'B7',
        'B8',
        'B9',
        'B10',
        'BJ',
        'BQ',
        'BK',
        'BA',
      ],
      isTrump: false,
      isDefault: false,
    },
    C: {
      name: 'Session Management',
      abbreviation: 'Sessn',
      cards: [
        'C2',
        'C3',
        'C4',
        'C5',
        'C6',
        'C7',
        'C8',
        'C9',
        'C10',
        'CJ',
        'CQ',
        'CK',
        'CA',
      ],
      isTrump: false,
      isDefault: false,
    },
    D: {
      name: 'Authorization',
      abbreviation: 'AuthZ',
      cards: [
        'D2',
        'D3',
        'D4',
        'D5',
        'D6',
        'D7',
        'D8',
        'D9',
        'D10',
        'DJ',
        'DQ',
        'DK',
        'DA',
      ],
      isTrump: false,
      isDefault: false,
    },
    E: {
      name: 'Authentication',
      abbreviation: 'AuthN',
      cards: [
        'E2',
        'E3',
        'E4',
        'E5',
        'E6',
        'E7',
        'E8',
        'E9',
        'E10',
        'EJ',
        'EQ',
        'EK',
        'EA',
      ],
      isTrump: false,
      isDefault: true,
    },
    T: {
      name: 'Cornucopia',
      abbreviation: 'Cornu',
      cards: [
        'T2',
        'T3',
        'T4',
        'T5',
        'T6',
        'T7',
        'T8',
        'T9',
        'T10',
        'TJ',
        'TQ',
        'TK',
        'TA',
      ],
      isTrump: true,
      isDefault: false,
    },
  },
  [GameMode.CUMULUS]: {
    A: {
      name: 'Resources',
      abbreviation: 'Res',
      cards: [
        'A4',
        'A5',
        'A6',
        'A7',
        'A8',
        'A9',
        'A10',
        'AJ',
        'AQ',
        'AK',
        'AA',
      ],
      isTrump: false,
      isDefault: true,
    },
    B: {
      name: 'Monitoring',
      abbreviation: 'Mon',
      cards: ['B6', 'B7', 'B8', 'B9', 'B10', 'BJ', 'BQ', 'BK', 'BA'],
      isTrump: false,
      isDefault: false,
    },
    C: {
      name: 'Recovery',
      abbreviation: 'Rec',
      cards: [
        'C3',
        'C4',
        'C5',
        'C6',
        'C7',
        'C8',
        'C9',
        'C10',
        'CJ',
        'CQ',
        'CK',
        'CA',
      ],
      isTrump: false,
      isDefault: false,
    },
    D: {
      name: 'Delivery',
      abbreviation: 'Del',
      cards: [
        'D2',
        'D3',
        'D4',
        'D5',
        'D6',
        'D7',
        'D8',
        'D9',
        'D10',
        'DJ',
        'DQ',
        'DK',
        'DA',
      ],
      isTrump: false,
      isDefault: false,
    },
    E: {
      name: undefined,
      abbreviation: undefined,
      cards: [],
      isTrump: false,
      isDefault: false,
    },
    T: {
      name: 'Access & Secrets',
      abbreviation: 'XsSec',
      cards: [
        'T2',
        'T3',
        'T4',
        'T5',
        'T6',
        'T7',
        'T8',
        'T9',
        'T10',
        'TJ',
        'TQ',
        'TK',
        'TA',
      ],
      isTrump: true,
      isDefault: false,
    },
  },
};

export function getStartingCard(gameMode: GameMode, suit: Suit): Card {
  const usedSuit =
    CARD_DECKS[gameMode][suit].cards.length > 0
      ? suit
      : getDefaultStartingSuit(gameMode);

  return CARD_DECKS[gameMode][usedSuit].cards[0];
}

function getDefaultStartingSuit(gameMode: GameMode): Suit {
  return (
    (Object.keys(CARD_DECKS[gameMode]) as Suit[]).find(
      (suit) => CARD_DECKS[gameMode][suit].isDefault,
    ) ?? 'A'
  );
}

export function getSuits(gameMode: GameMode): Suit[] {
  return (Object.keys(CARD_DECKS[gameMode]) as Suit[]).filter(
    (suit) => CARD_DECKS[gameMode][suit].cards.length > 0,
  );
}

export function getSuitDisplayName(gameMode: GameMode, suit: Suit): string {
  return CARD_DECKS[gameMode]?.[suit]?.name ?? '';
}

function getCardAbbreviation(gameMode: GameMode, card: Card): string {
  const suitHoldingCard = Object.values(CARD_DECKS[gameMode] ?? []).find(
    (suit) => suit.cards.length > 0 && suit.cards.includes(card),
  );

  return suitHoldingCard?.abbreviation ?? '';
}

export function getCardDisplayName(
  gameMode: GameMode,
  card: Card | undefined,
): string {
  if (!card) {
    return ``;
  }

  const cardSuitAbbreviated = getCardAbbreviation(gameMode, card);
  const cardValue = card.substring(1);
  return `${cardSuitAbbreviated}${cardValue}`;
}

export function getAllCards(gameMode: GameMode): Card[] {
  return Object.values(CARD_DECKS[gameMode])
    .map((suit) => suit.cards)
    .reduce((accumulator, value) => accumulator.concat(value), []);
}

export function getCardScore(
  card: Card,
  currentSuit: Suit,
  gameMode: GameMode,
): number {
  if (isCardOfSuit(card, currentSuit)) {
    return getCardNumericalScore(card, gameMode);
  }

  const isTrump = getCardSuit(card, gameMode)?.isTrump;
  return isTrump ? getCardNumericalScore(card, gameMode) + 100 : 0;
}

function getCardNumericalScore(card: Card, gameMode: GameMode): number {
  const cardSuit = getCardSuit(card, gameMode);
  return cardSuit?.cards.indexOf(card) ?? 0;
}

function isCardOfSuit(card: Card, suit: Suit): boolean {
  return card.startsWith(suit);
}

function getCardSuit(card: Card, gameMode: GameMode): SuitDetails | undefined {
  return Object.values(CARD_DECKS[gameMode]).find((suit) =>
    suit.cards.includes(card),
  );
}

export function isSuitInDeck(suit: Suit, gameMode: GameMode): boolean {
  return Object.keys(CARD_DECKS[gameMode]).includes(suit);
}
