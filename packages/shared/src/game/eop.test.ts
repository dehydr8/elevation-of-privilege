import { Client } from 'boardgame.io/client';
import { Local } from 'boardgame.io/multiplayer';
import { getStartingCard } from '../utils/cardDefinitions';
import { DEFAULT_START_SUIT } from '../utils/constants';
import { DEFAULT_GAME_MODE } from '../utils/GameMode';
import { ElevationOfPrivilege } from './eop';

// TODO: refactor so that tests do not depend on each other
describe('game', () => {
  const spec = {
    game: ElevationOfPrivilege,
    numPlayers: 3,
    multiplayer: Local(),
  };
  const players = {
    '0': Client({ ...spec, playerID: '0' }),
    '1': Client({ ...spec, playerID: '1' }),
    '2': Client({ ...spec, playerID: '2' }),
  };

  let createdThreat: string | undefined;
  const STARTING_CARD = getStartingCard(DEFAULT_GAME_MODE, DEFAULT_START_SUIT);

  Object.values(players).forEach((p) => p.start());

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const startingPlayer = players['0'].getState()!.ctx.currentPlayer!;

  it("shouldn't start in a stage/phase", () => {
    expect(players['0'].getState()?.ctx.activePlayers).toBe(null);
    expect(players['0'].getState()?.ctx.phase).toBe(null);
  });

  it('should start with scores set to zero', () => {
    expect(players['0'].getState()?.G.scores).toStrictEqual([0, 0, 0]);
  });

  it('have correct order in ctx', () => {
    const state = players['0'].getState();
    expect(state?.ctx.playOrder).toStrictEqual(['0', '1', '2']);
  });

  it('should move to the threats stage when the first player makes a move', () => {
    const starting = players['0'].getState()?.ctx
      .currentPlayer as keyof typeof players;
    players[starting].moves.draw(STARTING_CARD);

    const state = players['0'].getState();
    expect(state?.G.dealt).toContain(STARTING_CARD);
    expect(state?.G.dealtBy).toBe(starting);
    expect(state?.G.suit).toBe(STARTING_CARD.slice(0, 1));
    expect(players['0'].getState()?.ctx.activePlayers).toStrictEqual({
      '0': 'threats',
      '1': 'threats',
      '2': 'threats',
    });
  });

  it('the played card should not be present in the deck', () => {
    const lastPlayer = players['0'].getState()?.G
      .dealtBy as keyof typeof players;
    const cards = players[lastPlayer].getState()?.G.players[lastPlayer];
    expect(cards?.includes(STARTING_CARD)).toBe(false);
  });

  it('player should not be able to draw again', () => {
    const lastPlayer = players['0'].getState()?.G
      .dealtBy as keyof typeof players;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const cards = players[lastPlayer].getState()!.G.players[lastPlayer]!;
    const card = cards[Math.floor(Math.random() * cards.length)];

    players[lastPlayer].moves.draw(card);

    const state = players['0'].getState();

    expect(state?.G.dealt.includes(card)).toBe(false);
  });

  it('anyone should be able to select diagrams in a threats stage', () => {
    Object.values(players).forEach((p, i) => {
      p.moves.selectDiagram(i);
      const state = players['0'].getState();
      expect(state?.G.selectedDiagram).toBe(i);
    });
  });

  it('anyone should be able to select components in a threats stage', () => {
    Object.values(players).forEach((p, i) => {
      p.moves.selectComponent(`${i}`);
      const state = players['0'].getState();
      expect(state?.G.selectedComponent).toBe(`${i}`);
    });
  });

  it('anyone should be able to select threats in a threats stage', () => {
    Object.values(players).forEach((p, i) => {
      p.moves.selectThreat(`${i}`);
      const state = players['0'].getState();
      expect(state?.G.selectedThreat).toBe(`${i}`);
    });
  });

  it('anyone should be able to toggle the threat add modal in a threats stage', () => {
    Object.values(players).forEach((p) => {
      p.moves.toggleModal();
      const state = players['0'].getState();
      expect(state?.G.threat.modal).toBe(true);
      expect(state?.G.threat.owner).toBe(p.playerID);

      // only the owner should be able to toggle the modal again
      p.moves.toggleModal();
      const state2 = players['0'].getState();
      expect(state2?.G.threat.modal).toBe(false);
    });
  });

  it('the players who pass in the threats stage should not be able to toggle the modal', () => {
    players['0'].moves.pass();
    players['0'].moves.pass();
    players['0'].moves.toggleModal();
    const state = players['0'].getState();
    expect(state?.G.threat.modal).toBe(false);
  });

  it('the players who have passed should not be able to select a diagram', () => {
    players['0'].moves.selectDiagram('foo');
    const state = players['0'].getState();
    expect(state?.G.selectedDiagram).not.toBe('foo');
  });

  it('the players who have passed should not be able to select a component', () => {
    players['0'].moves.selectComponent('foo');
    const state = players['0'].getState();
    expect(state?.G.selectedComponent).not.toBe('foo');
  });

  it('the players who have passed should not be able to select a threat', () => {
    players['0'].moves.selectThreat('foo');
    const state = players['0'].getState();
    expect(state?.G.selectedThreat).not.toBe('foo');
  });

  it('the players who have not passed should be able to add a threat', () => {
    players['1'].moves.toggleModal();
    const state = players['0'].getState();
    const diagram = state?.G.selectedDiagram;
    const component = state?.G.selectedComponent;
    createdThreat = state?.G.threat.id;

    players['1'].moves.updateThreat('title', 'foo');
    players['1'].moves.updateThreat('description', 'bar');
    players['1'].moves.updateThreat('mitigation', 'baz');
    players['1'].moves.addOrUpdateThreat();

    const state2 = players['0'].getState();

    const t =
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      state2!.G.identifiedThreats[diagram!]![component!]![createdThreat!];
    expect(t.id).toBe(createdThreat);
    expect(t.owner).toBe('1');
    expect(t.title).toBe('foo');
    expect(t.description).toBe('bar');
    expect(t.mitigation).toBe('baz');
  });

  it('the players who have not passed and are owners should be able to toggle modal update', () => {
    players['1'].moves.toggleModalUpdate({
      owner: '1',
      title: 'foo',
      description: 'bar',
      mitigation: 'baz',
    });
    const state = players['0'].getState();
    expect(state?.G.threat.new).toBe(false);
    players['1'].moves.toggleModal();
  });

  it('the threat owners should be able to delete threats', () => {
    players['1'].moves.deleteThreat({
      owner: '1',
      id: createdThreat,
    });

    const state = players['0'].getState();
    const diagram = state?.G.selectedDiagram;
    const component = state?.G.selectedComponent;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(state!.G.identifiedThreats[diagram!]![component!]).toStrictEqual({});
  });

  it('should move on when all players have passed', () => {
    players['1'].moves.pass();
    players['2'].moves.pass();

    expect(players['0'].getState()?.ctx.activePlayers).toBe(null);
  });

  it('should respect the play order', () => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const state = players['0'].getState()!;
    const nextPlayer = (parseInt(startingPlayer) + 1) % state.ctx.numPlayers;
    expect(state.ctx.currentPlayer).toBe(nextPlayer.toString());
  });
});
