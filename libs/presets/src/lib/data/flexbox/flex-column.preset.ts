import { PresetCategory } from '@layout/models';

export const flexColumnPreset = {
  presetId: 'flex-columns',
  presetName: 'Flex columns',
  category: PresetCategory.FLEXBOX,
  presetDefinition: {
    itemType: 'CONTAINER',
    css: {
      layout: {
        display: 'flex',
      },
      flexboxGrid: {
        gap: 10,
        flexDirection: 'column',
      },
      spacing: {
        padding: '14px',
      },
    },
    children: [
      {
        content: '1',
        itemType: 'TEXT',
      },
      {
        content: '2',
        itemType: 'TEXT',
      },
      {
        content: '3',
        itemType: 'TEXT',
      },
    ],
  },
};
