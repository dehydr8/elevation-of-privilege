import { getDealtCard, getDealtCardsForPlayers, resolvePlayerNames, resolvePlayerName, grammarJoin, getPlayers, getComponentName, getValidMoves, getTypeString } from '../utils'
import { STARTING_CARD } from '../constants';

it('gets empty card if no card dealt', async () => {
  expect(getDealtCard({
    dealt: []
  })).toBe("");
});

it('gets correct card if a single card is dealt', async () => {
  expect(getDealtCard({
    dealt: ["A"]
  })).toBe("A");
});

it('gets correct card if a multiple cards are dealt', async () => {
  expect(getDealtCard({
    dealt: ["A", "B", "C"]
  })).toBe("C");
});

it('populates correct cards for players based on dealt cards', async () => {
  expect(getDealtCardsForPlayers(
    [0, 1, 2],
    ["A", "B", "C"]
  )).toStrictEqual(["A", "B", "C"]);

  expect(getDealtCardsForPlayers(
    [1, 0, 2],
    ["A", "B", "C"]
  )).toStrictEqual(["B", "A", "C"]);
});

it('resolves player names correctly', async () => {
  const names = ["foo", "bar", "baz"];
  expect(resolvePlayerNames(
    [0, 1, 2],
    names
  )).toStrictEqual(names);

  expect(resolvePlayerNames(
    [1, 0, 2],
    names
  )).toStrictEqual(["bar", "foo", "baz"]);

  expect(resolvePlayerNames(
    [1, 0, 2],
    names,
    1
  )).toStrictEqual(["You", "foo", "baz"]);
});

it('resolves player name correctly', async () => {
  const names = ["foo", "bar", "baz"];
  expect(resolvePlayerName(
    0,
    names
  )).toBe(names[0]);

  expect(resolvePlayerName(
    0,
    names,
    0
  )).toBe("You");
});

it('gammer joins correctly', async () => {
  expect(grammarJoin(["foo", "bar", "baz"])).toBe("foo, bar and baz");
  expect(grammarJoin(["foo", "bar"])).toBe("foo and bar");
  expect(grammarJoin(["foo"])).toBe("foo");
  expect(grammarJoin([])).toBeUndefined();
});

it('creates player array correctly', async () => {
  expect(getPlayers(3)).toStrictEqual(["0", "1", "2"]);
});

it('makes correct component name', async () => {
  expect(getComponentName(null)).toBe("");
  expect(getComponentName({
    type: "tm.Foo",
    attrs: {
      text: {
        text: "Bar"
      }
    }
  })).toBe("Foo: Bar");
  expect(getComponentName({
    type: "tm.Flow",
    labels: [{
      attrs: {
        text: {
          text: "Bar"
        }
      }
    }]
  })).toBe("Flow: Bar");
});

it('produces valid moves', async () => {
  expect(getValidMoves(
    [],
    "",
    0
  )).toStrictEqual([STARTING_CARD]);

  expect(getValidMoves(
    ["T4", "S2", "EA", "T5"],
    "T",
    10
  )).toStrictEqual(["T4", "T5"]);

  expect(getValidMoves(
    ["S2", "EA"],
    "T",
    10
  )).toStrictEqual(["S2", "EA"]);
});

it('produces correct type string', async () => {
  expect(getTypeString("FOO")).toBe("");
});