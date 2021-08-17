export const DECK_HANDS = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
export const DEFAULT_TURN_DURATION = 300;
export const DECK_SUITS = ['A', 'B', 'C', 'D', 'E', 'T'];
export const TRUMP_CARD_PREFIX = 'T';
export const DEFAULT_START_SUIT = 'E';
export const GAMEMODE_EOP = "Elevation of Privilege";
export const GAMEMODE_CORNUCOPIA = "OWASP Cornucopia";
export const DEFAULT_GAME_MODE = "Elevation of Privilege";
export const INVALID_CARDS = {[GAMEMODE_EOP]: ['E2', 'T2', 'T3', 'T4'], [GAMEMODE_CORNUCOPIA]: []};
export const STARTING_CARD_MAP = {
  [GAMEMODE_EOP]: {
    'D': 'D2',
    'E': 'E3',
    'C': 'C2',
    'B': 'B2',
    'A': 'A2',
    'T': 'T5'
  },
  [GAMEMODE_CORNUCOPIA]: {
    'D': 'D2',
    'E': 'E2',
    'C': 'C2',
    'B': 'B2',
    'A': 'A2',
    'T': 'T2'
  }
}

export const CARD_LIMIT = 26;
export const MIN_NUMBER_PLAYERS = 2;
export const MAX_NUMBER_PLAYERS = 9;

export const SERVER_PORT = process.env.SERVER_PORT || 8000;
export const API_PORT = process.env.API_PORT || 8001;
export const INTERNAL_API_PORT = process.env.INTERNAL_API_PORT || 8002;

export const DEFAULT_MODEL = {
  "summary": {
    "title": "Threat Modelling"
  },
  "detail": {
    "contributors": [],
    "diagrams": [
      {
        "title": "Threat Modelling",
        "diagramType": "STRIDE",
        "id": 0,
        "$$hashKey": "object:14",
        "diagramJson": {
          "cells": [
            {
              "type": "tm.Actor",
              "size": {
                "width": 160,
                "height": 80
              },
              "position": {
                "x": 50,
                "y": 50
              },
              "angle": 0,
              "id": "90cdcc2d-21ab-443d-ae95-f97a798429e7",
              "z": 1,
              "hasOpenThreats": false,
              "attrs": {
                ".element-shape": {
                  "class": "element-shape hasNoOpenThreats isInScope"
                },
                "text": {
                  "text": "Application"
                },
                ".element-text": {
                  "class": "element-text hasNoOpenThreats isInScope"
                }
              }
            }
          ]
        },
        "size": {
          "height": 590,
          "width": 790
        }
      }
    ]
  }
};