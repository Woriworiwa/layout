import { aiPreset } from './ai.preset';
import { navbarPreset } from './layouts/navbar.preset';
import { sideBarPreset } from './layouts/side-bar.preset';
import { holyGrailPreset } from './layouts/holy-grail.preset';
import { cardPreset } from './layouts/card.preset';
import { basicGridPresets } from './grid/grid-basic.presets';
import { textPreset } from './text.preset';
import { justifyContentGuidePreset } from './justify-content-guide.preset';
import { flexPresets } from './flexbox';
import { emptyContainerPreset } from './empty-container.preset';

export const allPresets = [
  emptyContainerPreset,
  textPreset,
  aiPreset,
  ...flexPresets,
  ...basicGridPresets,
  justifyContentGuidePreset,
  cardPreset,
  holyGrailPreset,
  navbarPreset,
  sideBarPreset,
];
