import {
  CARD_LIMIT,
  DEFAULT_START_SUIT,
  ModelType,
} from '../../utils/constants';
import { GameMode } from '../../utils/GameMode';
import { endTurnIf, setupGame, shuffleCards } from '../utils';
import seedrandom from 'seedrandom';

import type { SetupData } from '../setupData';
import {
  getAllCards,
  getStartingCard,
  Suit,
} from '../../utils/cardDefinitions';
import type { Card } from 'reactstrap';
import type { Ctx, DefaultPluginAPIs, FnContext } from 'boardgame.io';
import type { GameState } from '../gameState';

type DefaultContext = DefaultPluginAPIs & { ctx: Ctx };

describe('utils', () => {
  describe('setupGame', () => {
    const context = {
      random: {
        Shuffle: (deck) => deck,
      },
      ctx: { numPlayers: 1 },
    } as DefaultContext;

    it('when the model is an image, starts off with a selected dummy component, so the entire image is treated as selected', () => {
      const game = setupGame(context, {
        modelType: ModelType.IMAGE,
      } as SetupData);

      expect(game.selectedComponent).toBeTruthy();
    });

    [
      {
        testCase: 'a Threat Dragon model',
        modelType: ModelType.THREAT_DRAGON,
      },
    ].forEach(({ testCase, modelType }) =>
      it(`when the model is ${testCase}, starts off with no selected component`, () => {
        const game = setupGame(context, { modelType } as SetupData);

        expect(game.selectedComponent).toEqual('');
      }),
    );
  });

  describe('shuffleCards', () => {
    // The idea behind these tests is that the functionality of 'shuffleCards'
    // strongly depends on how the cards get randomly shuffled.
    // Create a large number of reproducible shufflings and hope that all relevant cases are covered.
    [
      '37e784e1f2d6',
      'dba82de704ce',
      'c31c8f67beda',
      '4b23875e07d5',
      'bb8f6df8aaad',
      'cbc665bdea1d',
      '33a633885076',
      '036d489534f1',
      'ebd94bc2faca',
      'cb98363c2b33',
      'fffbae6ba3c6',
      '03db8bd7ee06',
      'cfdbdb6cf016',
      'bbac51a69f98',
      '8f4753475942',
      '1b52d5c225bd',
      'df1d76fe2d97',
      'ff419b4d3a4e',
      'eb83c988e16e',
      'b7653656487c',
      'b39062d46994',
      'cfa5b75ae803',
      '175892b0d01c',
      'ffaeb494ef2d',
      '1ffcaae17e1d',
      '63583b4c2835',
      '77ac3beadf76',
      '33bf763b7de2',
      'cf74a13400ee',
      'f384ce842917',
      '7bf63faed171',
      'c30ef06a9077',
      '8bad931f842d',
      '93cc4ea7ab8f',
      '03695fbea1e2',
      '03db919702d9',
      'abbe49553f82',
      '4738de085643',
      '0f7bc971aad6',
      '4fc5112ed5fb',
      '3789717805a1',
      'df0b0bd054d4',
      '07cde6c25f13',
      '1b8c43bf94f5',
      'd362851b4f54',
      '13c46e09085d',
      'dbca023969d6',
      '5b26533ab65c',
      '034bd3f354ee',
      'f7cf91ae4086',
    ].forEach((seed) => {
      const random = seedrandom(seed);
      const fakedShuffle = <T>(items: T[]) => items.sort(() => random() - 0.5);
      const baseContext = {
        random: {
          Shuffle: (deck: Card[]) => fakedShuffle<Card>(deck),
        },
      };

      [
        {
          gameMode: GameMode.EOP,
          numPlayers: 2,
          expectedCardsPerHand: CARD_LIMIT,
        },
        {
          gameMode: GameMode.EOP,
          numPlayers: 3,
          expectedCardsPerHand: 26, // EoP has 6x13=78 cards. So, each player has floor(78/3)=26 cards
        },
        {
          gameMode: GameMode.EOP,
          numPlayers: 4,
          expectedCardsPerHand: 19, // EoP has 6x13=78 cards. So, each player has floor(78/4)=19 cards
        },
        {
          gameMode: GameMode.CORNUCOPIA,
          numPlayers: 2,
          expectedCardsPerHand: CARD_LIMIT,
        },
        {
          gameMode: GameMode.CORNUCOPIA,
          numPlayers: 3,
          expectedCardsPerHand: 26, // Cornucopia has 6x13=78 cards. So, each player has floor(78/3)=26 cards
        },
        {
          gameMode: GameMode.CORNUCOPIA,
          numPlayers: 4,
          expectedCardsPerHand: 19, // Cornucopia has 6x13=78 cards. So, each player has floor(78/4)=19 cards
        },
      ].forEach(({ gameMode, numPlayers, expectedCardsPerHand }) => {
        const deck = getAllCards(gameMode);
        const startingCard = getStartingCard(gameMode, DEFAULT_START_SUIT);

        const context = {
          ...baseContext,
          ctx: { numPlayers },
        } as DefaultContext;

        it(`should return hands in the correct dimensions for ${numPlayers} players for ${gameMode} (seed=${seed})`, () => {
          const shuffledCards = shuffleCards(context, deck, startingCard);

          expect(shuffledCards.length).toEqual(numPlayers);
          expect(shuffledCards[0].length).toEqual(expectedCardsPerHand);
          expect(shuffledCards[1].length).toEqual(expectedCardsPerHand);
        });

        it(`should contain the starting card in any hand for ${numPlayers} players for ${gameMode} (seed=${seed})`, () => {
          const shuffledCards = shuffleCards(context, deck, startingCard);

          expect(
            shuffledCards.some((cards) => cards.includes(startingCard)),
          ).toBeTruthy();
        });
      });
    });
  });

  describe(`endTurnIf`, () => {
    const context = {
      random: {
        Shuffle: (deck) => deck,
      },
      ctx: { numPlayers: 5 },
    } as DefaultContext;

    const setupData = {
      modelType: ModelType.IMAGE,
      gameMode: GameMode.EOP,
    } as SetupData;

    it(`should return false if not every player did pass`, () => {
      const G = {
        ...setupGame(context, setupData),
        passed: ['1', '2', '3', '4'],
        suit: DEFAULT_START_SUIT as Suit,
      };

      const shouldEndTurn = endTurnIf({ ...context, G });
      expect(shouldEndTurn).toBeFalsy();
    });

    it(`should return true if every player did pass`, () => {
      const G = {
        ...setupGame(context, setupData),
        passed: ['1', '2', '3', '4', '5'],
        suit: DEFAULT_START_SUIT as Suit,
      };

      const shouldEndTurn = endTurnIf({ ...context, G });
      expect(shouldEndTurn).toBeTruthy();
    });

    it(`should return winner of round`, () => {
      const G = {
        ...setupGame(context, setupData),
        passed: ['1', '2', '3', '4', '5'],
        suit: DEFAULT_START_SUIT as Suit,
        numCardsPlayed: 5,
        dealt: ['E2', 'EQ', 'AK', 'E3', 'E4'],
      };

      const roundWinner = endTurnIf({ ...context, G }) as { next: string };
      expect(roundWinner.next).toEqual('1');
    });

    it(`should return winner of round if trump was played`, () => {
      const G = {
        ...setupGame(context, setupData),
        passed: ['1', '2', '3', '4', '5'],
        suit: DEFAULT_START_SUIT as Suit,
        numCardsPlayed: 5,
        dealt: ['E2', 'EQ', 'AK', 'T5', 'E4'],
      };

      const roundWinner = endTurnIf({ ...context, G }) as { next: string };
      expect(roundWinner.next).toEqual('3');
    });
  });
});
