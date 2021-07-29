import { CARD_LIMIT, DECK_HANDS, DECK_SUITS, INVALID_CARDS, TRUMP_CARD_PREFIX } from '../utils/constants';



let scores = {};
let deck = [];
for (let i=0; i<DECK_SUITS.length; i++) {
  for (let j=0; j<DECK_HANDS.length; j++) {
    let c = DECK_SUITS[i] + DECK_HANDS[j];
    deck.push(c);
    scores[c] = j;
    if (DECK_SUITS[i] === TRUMP_CARD_PREFIX) {
      scores[c] += 100;
    }
  }
}
// remove invalid cards
INVALID_CARDS.forEach(c => deck.splice(deck.indexOf(c), 1));

export function shuffleCards(ctx, startingCard) {
  let players = [];
  let totalCardsToDeal = Math.min(
    Math.floor(deck.length / ctx.numPlayers) * ctx.numPlayers, 
    CARD_LIMIT * ctx.numPlayers
  );
  //totalCardsToDeal = ctx.numPlayers * 2;

  // shuffle the deck first
  let shuffled = ctx.random.Shuffle(deck);
  
  // remove the startingCard card and resize to totalCardsToDeal
  shuffled.splice(shuffled.indexOf(startingCard), 1);
  shuffled = shuffled.slice(0, totalCardsToDeal - 1);

  // make sure startingCard is in the shuffled cards
  shuffled.push(startingCard);
  shuffled = ctx.random.Shuffle(shuffled);

  let cardsToDeal = totalCardsToDeal / ctx.numPlayers;
  let first = 0;

  for (let i=0; i<cardsToDeal*ctx.numPlayers; i+=cardsToDeal) {
    let slice = shuffled.slice(i, i+cardsToDeal);
    players.push(slice);

    if (slice.indexOf(startingCard) >= 0)
      first = i / cardsToDeal;
  }

  return {
    players,
    first,
    cardsToDeal,
  }
}

export function getWinner(suit, dealt) {
  let winner = 0, max = -1;
  for (let i=0; i<dealt.length; i++) {
    let c = dealt[i];
    if (c.startsWith(suit) || c.startsWith(TRUMP_CARD_PREFIX)) {
      let score = scores[c];
      if (score > max) {
        max = score;
        winner = i.toString();
      }
    }
  }
  return winner;
}

export function endGameIf(G, ctx) {
  if (G.round > G.maxRounds) {
    let scores = [...G.scores];
    let winner = 0, max = -1;
    for (let i=0; i<scores.length; i++) {
      if (scores[i] > max) {
        winner = i;
        max = scores[i];
      }
    }
    return winner;
  }
}

export function endTurnIf(G, ctx) {
  let passed = [...G.passed];
  if(passed.length >= ctx.numPlayers) {
    if(G.numCardsPlayed >= ctx.numPlayers) {
      //end of trick
      let lastWinner = getWinner(G.suit, G.dealt);
      return {next: lastWinner};  // choose next player
    }
    return true;
  };
  return false;
}

export function onTurnEnd(G, ctx) {
  let dealt = [...G.dealt];
  let suit = G.suit;
  let dealtBy = G.dealtBy;
  let scores = [...G.scores];
  let round = G.round;
  let lastWinner = G.lastWinner;
  let numCardsPlayed = G.numCardsPlayed

  // calculate the scores
  //end of trick
  if (numCardsPlayed >= ctx.numPlayers) {
    lastWinner = getWinner(suit, dealt);

    scores[lastWinner]++;

    dealt = [];
    suit = "";
    dealtBy = "";
    numCardsPlayed = 0;
    round++;
  }
  return {
    ...G,
    dealt,
    lastWinner,
    dealtBy,
    suit,
    scores,
    numCardsPlayed,
    round,
    passed: [], // reset the passed array when the phase ends
  }
}