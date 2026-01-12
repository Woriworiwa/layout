import { PresetCategory } from '@layout/models';

export const cardPreset = {
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
      border: {
        borderRadius: '8px',
      },
    },
    children: [
      {
        content: 'Card Title',
        itemType: 'TEXT',
        css: {
          typography: {
            fontSize: '18px',
            fontWeight: '600',
          },
        },
      },
      {
        content:
          'Card description goes here. This is a sample card layout with title and content.',
        itemType: 'TEXT',
        css: {
          typography: {
            fontSize: '14px',
          },
        },
      },
      {
        content: 'Action',
        itemType: 'TEXT',
        css: {
          spacing: {
            padding: '8px 16px',
          },
          border: {
            borderRadius: '4px',
          },
        },
      },
    ],
  },
};
