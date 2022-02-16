import type { DeckSuit } from '../utils/constants';

export interface Threat {
  modal: boolean;
  new: boolean;
  id?: string;
  owner?: string;
  title?: string;
  type?: DeckSuit;
  severity?: string;
  description?: string;
  mitigation?: string;
}
