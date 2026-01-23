import { Preset, PresetCategory } from '@layout/models';

export const centeredContentPreset: Preset = {
  presetId: 'centered-content',
  presetName: 'Centered content',
  category: PresetCategory.FLEXBOX,
  presetDefinition: {
    itemType: 'CONTAINER',
    css: {
      layout: {
        display: 'flex',
      },
      flexboxGrid: {
        justifyContent: 'center',
        alignItems: 'center',
      },
      spacing: {
        padding: '6px',
      },
    },
    children: [
      {
        itemType: 'CONTAINER',
        css: {
          layout: {
            display: 'flex',
          },
          flexboxGrid: {
            gap: '16px',
            alignItems: 'center',
            flexDirection: 'column',
          },
          spacing: {
            padding: '24px',
          },
        },
        children: [
          {
            content: 'Welcome',
            itemType: 'TEXT',
          },
          {
            content: 'Perfectly centered content',
            itemType: 'TEXT',
          },
        ],
      },
    ],
  },
};
