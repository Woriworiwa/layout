import { Preset, PresetCategory } from '@layout/models';

export const justifyContentPreset: Preset = {
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
        gap: '10px',
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
            gap: '10px',
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
            label: 's',
          },
          {
            content: '',
            itemType: 'TEXT',
            key: 'qShloWjl',
          },
          {
            content: '',
            itemType: 'TEXT',
            key: 'DhoAAixA',
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
            gap: '10px',
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
          },
          {
            content: '',
            itemType: 'TEXT',
            key: 'tWtJSRTK',
          },
          {
            content: '',
            itemType: 'TEXT',
            key: 'ksFIzJLC',
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
            gap: '10px',
            justifyContent: 'center',
            flexGrow: 1,
          },
        },
        children: [
          {
            content: '',
            itemType: 'TEXT',
            key: 'myzorIDv',
          },
          {
            content: '',
            itemType: 'TEXT',
            key: 'HkPqKape',
          },
          {
            content: '',
            itemType: 'TEXT',
            key: 'ymRedXtF',
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
