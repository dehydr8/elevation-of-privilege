import {
  MODEL_TYPE_DEFAULT,
  MODEL_TYPE_IMAGE,
  MODEL_TYPE_THREAT_DRAGON,
} from '../../utils/constants';
import { EOPCtx } from '../context';
import { EOPSetupData } from '../setupData';
import { setupGame } from '../utils';

describe('utils', () => {
  const ctx = {
    random: {
      Shuffle: (deck) => deck,
    },
  } as EOPCtx;

  describe('setupGame', () => {
    it('when the model is an image, starts off with a selected dummy component, so the entire image is treated as selected', () => {
      const game = setupGame(ctx, {
        modelType: MODEL_TYPE_IMAGE,
      } as EOPSetupData);

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
        const game = setupGame(ctx, { modelType } as EOPSetupData);

        expect(game.selectedComponent).toEqual('');
      }),
    );
  });
});
