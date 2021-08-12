import { GAMEMODE_CORNUCOPIA } from "./constants";

export function getDealtCard(G) {
  let dealtCard = "";
  if (G.dealt.length > 0) {
    dealtCard = G.dealt[G.dealt.length - 1];
  }
  return dealtCard;
}

export function isGameModeCornucopia(gameMode) {
  return (gameMode === GAMEMODE_CORNUCOPIA);
}

export function getCardName(card, gameMode) {
  if (!card) {
    return '';
  }
  if (isGameModeCornucopia(gameMode)) {
    return getAbbreviationForCornucopia(card) + card.substr(1);
  } else {
    return getAbbreviationForEoP(card) + card.substr(1);
  }
}

export function resolvePlayerNames(players, names, current) {
  let resolved = [];
  for (let i = 0; i < players.length; i++) {
    let c = players[i];
    resolved.push((parseInt(c) === parseInt(current)) ? "You" : names[c]);
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
  for (let i = 0; i < count; i++) {
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

export function getValidMoves(cards, suit, round, startingCard) {
  let validMoves = [];

  if (suit === "" && round <= 1) {
    validMoves.push(startingCard);
  } else {
    if (suit !== "")
      validMoves = cards.filter(e => e.startsWith(suit));
    if (validMoves.length <= 0)
      validMoves = cards;
  }

  return validMoves;
}

export function getTypeString(type, gameMode) {
  let map;
  if (isGameModeCornucopia(gameMode)) {
    map = {
      "A": "Data Validation & Encoding",
      "B": "Cryptography",
      "C": "Session Management",
      "D": "Authorization",
      "E": "Authentication",
      "T": "Cornucopia",
    }
  } else {
    map = {
      "A": "Denial of Service",
      "B": "Information Disclosure",
      "C": "Repudiation",
      "D": "Spoofing",
      "E": "Tampering",
      "T": "Elevation of privilege",
    }
  }
  if (type in map) {
    return map[type];
  }
  return "";
}


export function getAbbreviationForEoP(card) {
  let category = card.substr(0, 1);
  let map = {
    "A": "D",
    "B": "I",
    "C": "R",
    "D": "S",
    "E": "T",
    "T": "E",
  }
  if (category in map) {
    return map[category];
  }
  return "";
}

export function getAbbreviationForCornucopia(card) {
  let category = card.substr(0, 1);
  let map = {
    "A": "Data",
    "B": "Crypt",
    "C": "Sessn",
    "D": "AuthZ",
    "E": "AuthN",
    "T": "Cornu",
  }
  if (category in map) {
    return map[category];
  }
  return "";
}



export function escapeMarkdownText(text) {
  //replaces certain characters with an escaped version
  //doesn't escape * or _ to allow users to format the descriptions

  return text.replace(/[![\]()]/gm, '\\$&').replace(/</gm, '&lt;').replace(/>/gm, '&gt;')
}

export async function copyToClipboard(text) {
  return await navigator.clipboard.writeText(text);
}