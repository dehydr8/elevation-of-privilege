import { STARTING_CARD } from './constants';

export function getDealtCard(G) {
  let dealtCard = "";
  if (G.dealt.length > 0) {
      dealtCard = G.dealt[G.dealt.length - 1];
  }
  return dealtCard;
}

export function getDealtCardsForPlayers(order, dealt) {
  let cards = Array(order.length).fill("");
  for (let i=0; i<dealt.length; i++) {
    let idx = parseInt(order[i]);
    cards[idx] = dealt[i];
  }
  return cards;
}

export function resolvePlayerNames(players, names, current) {
  let resolved = [];
  for (let i=0; i<players.length; i++) {
    let c = players[i];
    resolved.push( (parseInt(c) === parseInt(current)) ? "You" : names[c]);
  }
  return resolved;
}

export function resolvePlayerName(player, names, current) {
  return (parseInt(player) === parseInt(current)) ? "You" : names[player];
}

export function grammarJoin(arr) {
  var last = arr.pop();
  
  if (arr.length <= 0)
    return last;

  return arr.join(', ') + ' and ' + last;
}

export function getPlayers(count) {
  let players = [];
  for (let i=0; i<count; i++) {
    players.push(i + '');
  }
  return players;
}

export function getComponentName(component) {
  if (component === null)
    return "";

  let prefix = component.type.substr(3);

  if (component.type === "tm.Flow") {
    return `${prefix}: ${component.labels[0].attrs.text.text}`;
  }

  return `${prefix}: ${component.attrs.text.text}`;
}

export function getValidMoves(cards, suit, round) {
  let validMoves = [];

  if (suit === "" && round <= 1) {
    validMoves.push(STARTING_CARD);
  } else {
    if (suit !== "")
      validMoves = cards.filter(e => e.startsWith(suit));
    if (validMoves.length <= 0)
      validMoves = cards;
  }

  return validMoves;
}

export function getTypeString(type) {
  let map = {
    "S": "Spoofing",
    "T": "Tampering",
    "R": "Repudiation",
    "I": "Information disclosure",
    "D": "Denial of service",
    "E": "Elevation of privilege",
  }
  if (type in map) {
    return map[type];
  }
  return "";
}