import { PresetCategory } from '@layout/models';

export const justifyContentPreset = {
  presetId: 'justify-content',
  presetName: 'Justify content',
  category: PresetCategory.FLEXBOX,
  presetDefinition: {
    itemType: 'CONTAINER',
    css: {
      spacing: {
        padding: '16px',
      },
      layout: {
        display: 'flex',
      },
      flexboxGrid: {
        gap: '10',
        flexDirection: 'row',
        flexWrap: 'nowrap',
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
            gap: '10',
            justifyContent: 'start',
            flexDirection: 'row',
            flexWrap: 'wrap',
            flexGrow: 1,
          },
          spacing: {
            padding: '16px',
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
          layout: {
            display: 'flex',
          },
          flexboxGrid: {
            gap: '10',
            justifyContent: 'end',
            flexDirection: 'row',
            flexWrap: 'wrap',
            flexGrow: 1,
          },
          spacing: {
            padding: '16px',
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
          layout: {
            display: 'flex',
          },
          spacing: {
            padding: '16px',
          },
          flexboxGrid: {
            gap: '10',
            justifyContent: 'center',
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
