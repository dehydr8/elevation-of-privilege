import { GameMode } from '../utils/GameMode';
import { getThreatDescription } from './definitions';

it('produces empty value for non-existent card', () => {
  const description = getThreatDescription('NN', GameMode.EOP);
  expect(description).toBe('');
});

it('produces empty value for cornucopia gamemode', () => {
  const description = getThreatDescription('D2', GameMode.CORNUCOPIA);
  expect(description).toBe('');
});

it('produces correct value for existing card', () => {
  const description = getThreatDescription('D2', GameMode.EOP);
  expect(description).toBe(
    'An attacker could take over the port or socket that the server normally uses.',
  );
});
