import { getSuitDisplayName } from '../cardDefinitions';
import { STARTING_CARD } from '../constants';
import {
  escapeMarkdownText,
  getComponentName,
  getDealtCard,
  getPlayers,
  getValidMoves,
  grammarJoin,
  resolvePlayerName,
  resolvePlayerNames,
} from '../utils';

it('getDealtCard() should get empty card if no card dealt', async () => {
  const G = {
    dealt: [],
    dealtBy: '',
  };

  const dealtCard = getDealtCard(G);

  expect(dealtCard).toBe('');
});

it('getDealtCard() should get correct card if a single card is dealt', async () => {
  const G = {
    dealt: [null, null, 'E3'],
    dealtBy: '2',
  };

  const dealtCard = getDealtCard(G);

  expect(dealtCard).toBe('E3');
});

it('getDealtCard() should get correct card if a multiple cards are dealt', async () => {
  const G = {
    dealt: ['E8', 'EA', 'E3'],
    dealtBy: '1',
  };

  const dealtCard = getDealtCard(G);

  expect(dealtCard).toBe('EA');
});

it('resolves player names correctly', async () => {
  const names = ['foo', 'bar', 'baz'];
  expect(resolvePlayerNames([0, 1, 2], names)).toStrictEqual(names);

  expect(resolvePlayerNames([1, 0, 2], names)).toStrictEqual([
    'bar',
    'foo',
    'baz',
  ]);

  expect(resolvePlayerNames([1, 0, 2], names, 1)).toStrictEqual([
    'You',
    'foo',
    'baz',
  ]);
});

it('resolves player name correctly', async () => {
  const names = ['foo', 'bar', 'baz'];
  expect(resolvePlayerName(0, names)).toBe(names[0]);

  expect(resolvePlayerName(0, names, 0)).toBe('You');
});

it('gammer joins correctly', async () => {
  expect(grammarJoin(['foo', 'bar', 'baz'])).toBe('foo, bar and baz');
  expect(grammarJoin(['foo', 'bar'])).toBe('foo and bar');
  expect(grammarJoin(['foo'])).toBe('foo');
  expect(grammarJoin([])).toBeUndefined();
});

it('creates player array correctly', async () => {
  expect(getPlayers(3)).toStrictEqual(['0', '1', '2']);
});

it('makes correct component name', async () => {
  expect(getComponentName(null)).toBe('');
  expect(
    getComponentName({
      type: 'tm.Foo',
      attrs: {
        text: {
          text: 'Bar',
        },
      },
    }),
  ).toBe('Foo: Bar');
  expect(
    getComponentName({
      type: 'tm.Flow',
      labels: [
        {
          attrs: {
            text: {
              text: 'Bar',
            },
          },
        },
      ],
    }),
  ).toBe('Flow: Bar');
});

it('produces valid moves', async () => {
  expect(getValidMoves([], '', 0)).toStrictEqual([STARTING_CARD]);

  expect(getValidMoves(['T4', 'S2', 'EA', 'T5'], 'T', 10)).toStrictEqual([
    'T4',
    'T5',
  ]);

  expect(getValidMoves(['S2', 'EA'], 'T', 10)).toStrictEqual(['S2', 'EA']);
});

it('produces correct type string', async () => {
  expect(getSuitDisplayName('FOO')).toBe('');
});

it('successfully escapes any malicious markdown text', () => {
  expect(
    escapeMarkdownText(
      '![The goodest boy](https://images.unsplash.com/the_good_boy.png)',
    ),
  ).toBe(
    '\\!\\[The goodest boy\\]\\(https://images.unsplash.com/the_good_boy.png\\)',
  );

  expect(
    escapeMarkdownText('<a href="javascript:alert(\'XSS\')">Click Me</a>'),
  ).toBe('&lt;a href="javascript:alert\\(\'XSS\'\\)"&gt;Click Me&lt;/a&gt;');

  expect(escapeMarkdownText('![Uh oh...]("onerror="alert(\'XSS\'))')).toBe(
    '\\!\\[Uh oh...\\]\\("onerror="alert\\(\'XSS\'\\)\\)',
  );
});
