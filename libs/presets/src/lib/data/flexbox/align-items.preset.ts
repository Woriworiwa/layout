import { PresetCategory } from '@layout/models';

export const alignItemsPreset = {
  presetId: 'align-items',
  presetName: 'Align items',
  category: PresetCategory.FLEXBOX,
  presetDefinition: {
    itemType: 'CONTAINER',
    children: [
      {
        itemType: 'CONTAINER',
        css: {
          display: {
            display: 'flex',
          },
          container: {
            gap: '10',
            alignItems: 'start',
          },
          flexContainer: {
            flexDirection: 'row',
          },
          boxSizing: {
            padding: '16px',
          },
          flexItem: {
            flexGrow: 1,
          },
        },
        children: [
          {
            content: '',
            itemType: 'TEXT',
            key: 'ZFUurKho',
            children: [],
          },
          {
            content: '',
            itemType: 'TEXT',
            key: 'lPnOHtQs',
            children: [],
          },
          {
            content: '',
            itemType: 'TEXT',
            key: 'mZtqGjIo',
            children: [],
          },
        ],
        key: 'gMqwjNyj',
        label: 'start',
      },
      {
        itemType: 'CONTAINER',
        css: {
          display: {
            display: 'flex',
          },
          boxSizing: {
            padding: '16px',
          },
          container: {
            gap: '10',
            alignItems: 'end',
          },
          flexItem: {
            flexGrow: 1,
          },
        },
        children: [
          {
            content: '',
            itemType: 'TEXT',
            key: 'lFgNvpQM',
            children: [],
          },
          {
            content: '',
            itemType: 'TEXT',
            key: 'CYgGTYzI',
            children: [],
          },
          {
            content: '',
            itemType: 'TEXT',
            key: 'UhAwUJfM',
            children: [],
          },
        ],
        key: 'EThscolN',
        label: 'end',
      },
      {
        itemType: 'CONTAINER',
        css: {
          display: {
            display: 'flex',
          },
          boxSizing: {
            padding: '16px',
          },
          container: {
            gap: '10',
            alignItems: 'center',
          },
          flexItem: {
            flexGrow: 1,
          },
        },
        children: [
          {
            content: '',
            itemType: 'TEXT',
            key: 'UqsKxkWS',
            children: [],
          },
          {
            content: '',
            itemType: 'TEXT',
            key: 'YdCtHUiA',
            children: [],
          },
          {
            content: '',
            itemType: 'TEXT',
            key: 'wOkRlsCa',
            children: [],
          },
        ],
        key: 'fAvIaNoP',
        label: 'center',
      },
    ],
    key: 'jLZXSKxG',
    css: {
      display: {
        display: 'flex',
      },
      boxSizing: {
        height: '100px',
        padding: '16px',
      },
      container: {
        gap: 10,
        justifyContent: 'center',
      },
    },
    label: 'align-items',
  },
};
