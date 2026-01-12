import { PresetCategory } from '@layout/models';

export const emptyContainerPreset = {
  presetId: 'empty-container',
  presetName: 'Empty Container',
  category: PresetCategory.ROOT,
  presetDefinition: {
    itemType: 'CONTAINER',
    css: {
      layout: {
        display: 'flex',
      },
      spacing: {
        padding: '18px',
      },
    },
  },
};
