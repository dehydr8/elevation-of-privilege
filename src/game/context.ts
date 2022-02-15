import type { Ctx as BoardgameCtx } from 'boardgame.io';

export interface Ctx extends BoardgameCtx {
  gameover: number;
  random: Exclude<BoardgameCtx['random'], undefined>; // we use the default plugins, including the random plugin, making this always available
}
