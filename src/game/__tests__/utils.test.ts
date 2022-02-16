import {
  MODEL_TYPE_DEFAULT,
  MODEL_TYPE_IMAGE,
  MODEL_TYPE_THREAT_DRAGON,
} from '../../utils/constants';
import { setupGame } from '../utils';

import type { Ctx } from '../context';
import type { SetupData } from '../setupData';

describe('utils', () => {
  const ctx = {
    random: {
      Shuffle: (deck) => deck,
    },
  } as Ctx;

  describe('setupGame', () => {
    it('when the model is an image, starts off with a selected dummy component, so the entire image is treated as selected', () => {
      const game = setupGame(ctx, {
        modelType: MODEL_TYPE_IMAGE,
      } as SetupData);

      expect(game.selectedComponent).toBeTruthy();
    });

    [
      {
        testCase: 'the default model',
        modelType: MODEL_TYPE_DEFAULT,
      },
      {
        testCase: 'a Threat Dragon model',
        modelType: MODEL_TYPE_THREAT_DRAGON,
      },
    ].forEach(({ testCase, modelType }) =>
      it(`when the model is ${testCase}, starts off with no selected component`, () => {
        const game = setupGame(ctx, { modelType } as SetupData);

        expect(game.selectedComponent).toEqual('');
      }),
    );
  });
});
