import { PresetCategory } from '../../app/core/models/preset.model';

export const alignmentPresets = [
  {
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
  },
  {
    presetId: 'justify-content',
    presetName: 'Justify content',
    category: PresetCategory.FLEXBOX,
    presetDefinition: {
      itemType: 'CONTAINER',
      css: {
        boxSizing: {
          padding: '16px',
        },
        display: {
          display: 'flex',
        },
        container: {
          gap: '10',
        },
        flexContainer: {
          flexDirection: 'row',
          flexWrap: 'nowrap',
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
              gap: '10',
              justifyContent: 'start',
            },
            flexContainer: {
              flexDirection: 'row',
              flexWrap: 'wrap',
            },
            boxSizing: {
              padding: '16px',
            },
            flexItem: {
              flexGrow: 1,
            },
          },
          key: 'RpitIDkg',
          children: [
            {
              content: '',
              itemType: 'TEXT',
              key: 'uuYgbBcP',
              children: [],
              label: 's',
            },
            {
              content: '',
              itemType: 'TEXT',
              key: 'qShloWjl',
              children: [],
            },
            {
              content: '',
              itemType: 'TEXT',
              key: 'DhoAAixA',
              children: [],
            },
          ],
          label: 'start',
        },
        {
          itemType: 'CONTAINER',
          css: {
            display: {
              display: 'flex',
            },
            container: {
              gap: '10',
              justifyContent: 'end',
            },
            flexContainer: {
              flexDirection: 'row',
              flexWrap: 'wrap',
            },
            boxSizing: {
              padding: '16px',
            },
            flexItem: {
              flexGrow: 1,
            },
          },
          key: 'bbjgFMgH',
          children: [
            {
              content: '',
              itemType: 'TEXT',
              key: 'QlaCRNod',
              children: [],
            },
            {
              content: '',
              itemType: 'TEXT',
              key: 'tWtJSRTK',
              children: [],
            },
            {
              content: '',
              itemType: 'TEXT',
              key: 'ksFIzJLC',
              children: [],
            },
          ],
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
              justifyContent: 'center',
            },
            flexItem: {
              flexGrow: 1,
            },
          },
          children: [
            {
              content: '',
              itemType: 'TEXT',
              key: 'myzorIDv',
              children: [],
            },
            {
              content: '',
              itemType: 'TEXT',
              key: 'HkPqKape',
              children: [],
            },
            {
              content: '',
              itemType: 'TEXT',
              key: 'ymRedXtF',
              children: [],
            },
          ],
          key: 'AVaSIjvF',
          label: 'center',
        },
      ],
      key: 'iVfyzObW',
      label: 'justify-content',
    },
  },
  {
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
        boxSizing: {
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
            },
            flexContainer: {
              flexDirection: 'column',
            },
            boxSizing: {
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
  },
];
