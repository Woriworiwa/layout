// Export individual preset categories
import { aiPreset } from './ai.preset';
import { navbarPreset } from './navbar.preset';
import { sideBarPreset } from './side-bar.preset';
import { holyGrailPreset } from './holy-grail.preset';
import { cardPreset } from './card.preset';
import { alignmentPresets } from './align-justify-centered.presets';
import { basicFlexPresets } from './flex-rows-columns.presets';
import { textPresets } from './text.preset';
import { justifyContentGuidePreset } from './guides/justify-content-guide.preset';
export { textPresets } from './text.preset';
export { flexGrowShrinkPreset } from './flex-grow-shrink.preset';

/**
 * Combined flex presets from all categories
 * Maintains backward compatibility with existing imports
 */
export const allPresets = [
  ...textPresets,
  ...basicFlexPresets,
  ...alignmentPresets,
  aiPreset,
  justifyContentGuidePreset,
  cardPreset,
  holyGrailPreset,
  navbarPreset,
  sideBarPreset,
];
