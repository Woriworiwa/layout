import { PresetCategory } from '@layout/models';

export const centeredContentPreset = {
  presetId: 'centered-content',
  presetName: 'Centered content',
  category: PresetCategory.FLEXBOX,
  presetDefinition: {
    itemType: 'CONTAINER',
    css: {
      display: {
        display: 'flex',
      },
      container: {
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
          display: {
            display: 'flex',
          },
          container: {
            gap: '16',
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
            css: {
              typography: {
                fontSize: '24px',
                fontWeight: 'bold',
              },
            },
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
