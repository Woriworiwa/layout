import { Preset, PresetCategory } from '@layout/models';

export const flexRowsPreset: Preset = {
  presetId: 'flex-rows',
  presetName: 'Flex rows',
  category: PresetCategory.FLEXBOX,
  presetDefinition: {
    itemType: 'CONTAINER',
    css: {
      layout: {
        display: 'flex',
      },
      flexboxGrid: {
        gap: '10px',
      },
      spacing: {
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
          spacing: {
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
};
