import { PresetCategory } from '@layout/models';

export const emptyContainerPreset = {
  presetId: 'empty-container',
  presetName: 'Empty Container',
  category: PresetCategory.ROOT,
  presetDefinition: {
    itemType: 'CONTAINER',
    css: {
      display: {
        display: 'flex',
      },
      boxSizing: {
        padding: '18px',
      },
    },
  },
};
