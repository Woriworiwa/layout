// Export individual preset categories
import { navbarPreset } from './navbar.preset';
import { sideBarPreset } from './side-bar.preset';
import { holyGrailPreset } from './holy-grail.preset';
import { cardPreset } from './card.preset';
import { alignmentPresets } from './align-justify-centered.presets';
import { basicFlexPresets } from './flex-rows-columns.presets';
export { textPresets } from './text.preset';
export { flexGrowShrinkPreset } from './flex-grow-shrink.preset';

/**
 * Combined flex presets from all categories
 * Maintains backward compatibility with existing imports
 */
export const allPresets = [
  ...basicFlexPresets,
  ...alignmentPresets,
  cardPreset,
  holyGrailPreset,
  navbarPreset,
  sideBarPreset
];
