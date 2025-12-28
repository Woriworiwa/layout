import { PresetCategory } from '@layout/models';

export const justifyContentPreset = {
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
};
