import { Preset, PresetCategory } from '@layout/models';

export const navbarPreset: Preset = {
  presetId: 'navbar',
  presetName: 'Navigation bar',
  category: PresetCategory.LAYOUTS,
  presetDefinition: {
    itemType: 'CONTAINER',
    css: {
      layout: {
        display: 'flex',
      },
      flexboxGrid: {
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '16px',
        flexDirection: 'row',
      },
      spacing: {
        padding: '12px 20px',
      },
    },
    children: [
      {
        content: 'Logo',
        itemType: 'TEXT',
      },
      {
        itemType: 'CONTAINER',
        css: {
          layout: {
            display: 'flex',
          },
          flexboxGrid: {
            gap: '20px',
          },
        },
        children: [
          {
            content: 'Home',
            itemType: 'TEXT',
          },
          {
            content: 'About',
            itemType: 'TEXT',
          },
          {
            content: 'Contact',
            itemType: 'TEXT',
          },
        ],
      },
    ],
  },
};
