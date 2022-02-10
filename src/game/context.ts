import type { Ctx } from 'boardgame.io';

export interface EOPCtx extends Ctx {
  gameover: number;
  random: Exclude<Ctx['random'], undefined>; // we use the default plugins, including the random plugin, making this always available
}
