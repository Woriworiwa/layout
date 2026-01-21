import { Preset, PresetCategory } from '@layout/models';

export const cardPreset: Preset = {
  presetId: 'card',
  presetName: 'Card',
  category: PresetCategory.LAYOUTS,
  presetDefinition: {
    itemType: 'CONTAINER',
    css: {
      layout: {
        display: 'flex',
      },
      flexboxGrid: {
        gap: '12',
        flexDirection: 'column',
      },
      spacing: {
        padding: '20px',
      },
      sizing: {
        width: '250px',
      },
    },
    children: [
      {
        content: 'Card Title',
        itemType: 'TEXT',
      },
      {
        content:
          'Card description goes here. This is a sample card layout with title and content.',
        itemType: 'TEXT',
      },
      {
        content: 'Action',
        itemType: 'TEXT',
        css: {
          spacing: {
            padding: '8px 16px',
          },
        },
      },
    ],
  },
};
