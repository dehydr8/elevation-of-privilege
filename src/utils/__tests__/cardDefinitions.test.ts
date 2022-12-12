import {
  getAllCards,
  getCardDisplayName,
  getCardScore,
  getStartingCard,
  getSuitDisplayName,
  getSuits,
} from '../cardDefinitions';
import { GameMode } from '../GameMode';

describe('cardDefintions', () => {
  describe('getStartingCard', () => {
    it('should return correct starting card for EoP', () => {
      const startingCard = getStartingCard(GameMode.EOP, 'E');
      expect(startingCard).toEqual('E2');
    });

    it('should return correct starting card for Cornucopia', () => {
      const startingCard = getStartingCard(GameMode.CORNUCOPIA, 'E');
      expect(startingCard).toEqual('E2');
    });
  });

  describe('getSuits', () => {
    it('should return correct suits for EoP', () => {
      const suits = getSuits(GameMode.EOP);
      expect(suits).toEqual(['A', 'B', 'C', 'D', 'E', 'T']);
    });

    it('should return correct suits for Cornucopia', () => {
      const suits = getSuits(GameMode.CORNUCOPIA);
      expect(suits).toEqual(['A', 'B', 'C', 'D', 'E', 'T']);
    });

    it('should return correct suits for Cumulus', () => {
      const suits = getSuits(GameMode.CUMULUS);
      expect(suits).toEqual(['A', 'B', 'C', 'D', 'T']);
    });
  });

  describe('getSuitDisplayName', () => {
    it('should return correct suit name for EoP', () => {
      const suitName = getSuitDisplayName(GameMode.EOP, 'C');
      expect(suitName).toEqual('Repudiation');
    });

    it('should return correct suit name for Cornucopia', () => {
      const suitName = getSuitDisplayName(GameMode.CORNUCOPIA, 'C');
      expect(suitName).toEqual('Session Management');
    });

    it('should return correct suit name for Cumulus', () => {
      const suitName = getSuitDisplayName(GameMode.CUMULUS, 'C');
      expect(suitName).toEqual('Recovery');
    });
  });

  describe('getCardDisplayName', () => {
    it('should return correct card name for EoP', () => {
      const cardName = getCardDisplayName(GameMode.EOP, 'C7');
      expect(cardName).toEqual('R7');
    });

    it('should return correct card name for Cornucopia', () => {
      const cardName = getCardDisplayName(GameMode.CORNUCOPIA, 'C7');
      expect(cardName).toEqual('Sessn7');
    });

    it('should return correct card name for Cumulus', () => {
      const cardName = getCardDisplayName(GameMode.CUMULUS, 'C7');
      expect(cardName).toEqual('Rec7');
    });
  });

  describe('getAllCards', () => {
    it('should return all cards from EoP', () => {
      const cards = getAllCards(GameMode.EOP);
      expect(cards.length).toEqual(6 * 13);
    });

    it('should return all cards from Cornucopia', () => {
      const cards = getAllCards(GameMode.CORNUCOPIA);
      expect(cards.length).toEqual(6 * 13);
    });

    it('should return all cards from Cumulus', () => {
      const cards = getAllCards(GameMode.CUMULUS);
      expect(cards.length).toEqual(13 + 13 + 12 + 9 + 11);
    });
  });

  describe('getCardScore', () => {
    it('should return correct score for card in current suit', () => {
      const currentSuit = 'C';
      const card1 = 'C7';
      const card2 = 'C9';
      const score1 = getCardScore(card1, currentSuit, GameMode.EOP);
      const score2 = getCardScore(card2, currentSuit, GameMode.EOP);

      expect(score1).toBeLessThan(score2);
    });

    it('should return zero score for card not in current suit', () => {
      const currentSuit = 'C';
      const card = 'A7';
      const score = getCardScore(card, currentSuit, GameMode.EOP);

      expect(score).toEqual(0);
    });

    it('should return high score for trump card', () => {
      const currentSuit = 'C';
      const card = 'T7';
      const score = getCardScore(card, currentSuit, GameMode.EOP);

      expect(score).toBeGreaterThan(100);
    });
  });
});
