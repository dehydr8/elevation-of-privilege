import type { Suit } from '../utils/cardDefinitions';

export interface Threat {
  modal: boolean;
  new: boolean;
  id?: string;
  owner?: string;
  title?: string;
  type?: Suit;
  severity?: string;
  description?: string;
  mitigation?: string;
}
