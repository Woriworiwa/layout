import { Preset, PresetCategory } from '@layout/models';

export const flexGrowShrinkPreset: Preset = {
  presetId: 'flex-grow-shrink',
  presetName: 'Flex grow & shrink',
  category: PresetCategory.FLEXBOX,
  presetDefinition: {
    itemType: 'CONTAINER',
    css: {
      layout: {
        display: 'flex',
      },
      flexboxGrid: {
        gap: '12',
      },
      spacing: {
        padding: '16px',
      },
      sizing: {
        width: '100%',
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
            justifyContent: 'center',
            alignItems: 'center',
            flexShrink: 0,
          },
          spacing: {
            padding: '20px',
          },
          sizing: {
            width: '100px',
          },
        },
        children: [
          {
            content: 'Fixed',
            itemType: 'TEXT',
          },
        ],
        label: 'flex-shrink: 0',
      },
      {
        itemType: 'CONTAINER',
        css: {
          layout: {
            display: 'flex',
          },
          flexboxGrid: {
            justifyContent: 'center',
            alignItems: 'center',
            flexGrow: 1,
          },
          spacing: {
            padding: '20px',
          },
        },
        children: [
          {
            content: 'Grows',
            itemType: 'TEXT',
          },
        ],
        label: 'flex-grow: 1',
      },
      {
        itemType: 'CONTAINER',
        css: {
          layout: {
            display: 'flex',
          },
          flexboxGrid: {
            justifyContent: 'center',
            alignItems: 'center',
            flexGrow: 2,
          },
          spacing: {
            padding: '20px',
          },
        },
        children: [
          {
            content: 'Grows 2x',
            itemType: 'TEXT',
          },
        ],
        label: 'flex-grow: 2',
      },
    ],
  },
};
