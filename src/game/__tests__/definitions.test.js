import { getThreatDescription } from '../definitions';

it('produces empty value for non-existent card', () => {
  const description = getThreatDescription("NN");
  expect(description).toBe("");
});

it('produces correct value for existing card', () => {
  const description = getThreatDescription("S2");
  expect(description).toBe("An attacker could squat on the random port or socket that the server normally uses");
});
