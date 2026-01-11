import { PresetCategory } from '@layout/models';

export const flexRowsPreset = {
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
