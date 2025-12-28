import { PresetCategory } from '../../app/core/models/preset.model';

export const basicFlexPresets = [
  {
    presetId: 'empty-flex',
    presetName: 'Empty Flex',
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
  },
  {
    presetId: 'flex-rows',
    presetName: 'Flex rows',
    category: PresetCategory.FLEXBOX,
    presetDefinition: {
      itemType: 'CONTAINER',
      css: {
        display: {
          display: 'flex',
        },
        container: {
          gap: 10,
        },
        boxSizing: {
          padding: '18px',
        },
      },
      children: [
        {
          content: '__    1   ____',
          itemType: 'TEXT',
        },
        {
          content: '_____    2    ______',
          itemType: 'TEXT',
          css: {
            boxSizing: {
              padding: '14px',
            },
          },
        },
        {
          content: '__________    3    __________',
          itemType: 'TEXT',
        },
      ],
    },
  },
  {
    presetId: 'flex-columns',
    presetName: 'Flex columns',
    category: PresetCategory.FLEXBOX,
    presetDefinition: {
      itemType: 'CONTAINER',
      css: {
        display: {
          display: 'flex',
        },
        container: {
          gap: 10,
        },
        flexContainer: {
          flexDirection: 'column',
        },
        boxSizing: {
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
  },
];
