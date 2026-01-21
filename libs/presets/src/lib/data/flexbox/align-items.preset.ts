import { Preset, PresetCategory } from '@layout/models';

export const alignItemsPreset: Preset = {
  presetId: 'align-items',
  presetName: 'Align items',
  category: PresetCategory.FLEXBOX,
  presetDefinition: {
    itemType: 'CONTAINER',
    children: [
      {
        itemType: 'CONTAINER',
        css: {
          layout: {
            display: 'flex',
          },
          flexboxGrid: {
            gap: '10',
            alignItems: 'start',
            flexDirection: 'row',
            flexGrow: 1,
          },
          spacing: {
            padding: '16px',
          },
        },
        children: [
          {
            content: '',
            itemType: 'TEXT',
            key: 'ZFUurKho',
          },
          {
            content: '',
            itemType: 'TEXT',
            key: 'lPnOHtQs',
          },
          {
            content: '',
            itemType: 'TEXT',
            key: 'mZtqGjIo',
          },
        ],
        key: 'gMqwjNyj',
        label: 'start',
      },
      {
        itemType: 'CONTAINER',
        css: {
          layout: {
            display: 'flex',
          },
          spacing: {
            padding: '16px',
          },
          flexboxGrid: {
            gap: '10',
            alignItems: 'end',
            flexGrow: 1,
          },
        },
        children: [
          {
            content: '',
            itemType: 'TEXT',
            key: 'lFgNvpQM',
          },
          {
            content: '',
            itemType: 'TEXT',
            key: 'CYgGTYzI',
          },
          {
            content: '',
            itemType: 'TEXT',
            key: 'UhAwUJfM',
          },
        ],
        key: 'EThscolN',
        label: 'end',
      },
      {
        itemType: 'CONTAINER',
        css: {
          layout: {
            display: 'flex',
          },
          spacing: {
            padding: '16px',
          },
          flexboxGrid: {
            gap: '10',
            alignItems: 'center',
            flexGrow: 1,
          },
        },
        children: [
          {
            content: '',
            itemType: 'TEXT',
            key: 'UqsKxkWS',
          },
          {
            content: '',
            itemType: 'TEXT',
            key: 'YdCtHUiA',
          },
          {
            content: '',
            itemType: 'TEXT',
            key: 'wOkRlsCa',
          },
        ],
        key: 'fAvIaNoP',
        label: 'center',
      },
    ],
    key: 'jLZXSKxG',
    css: {
      layout: {
        display: 'flex',
      },
      spacing: {
        padding: '16px',
      },
      sizing: {
        height: '100px',
      },
      flexboxGrid: {
        gap: '10',
        justifyContent: 'center',
      },
    },
    label: 'align-items',
  },
};
