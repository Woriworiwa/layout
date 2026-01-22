import { Preset, PresetCategory } from '@layout/models';

export const holyGrailPreset: Preset = {
  presetId: 'holy-grail',
  presetName: 'Holy grail layout',
  category: PresetCategory.LAYOUTS,
  presetDefinition: {
    itemType: 'CONTAINER',
    css: {
      layout: {
        display: 'flex',
      },
      flexboxGrid: {
        gap: '8px',
        flexDirection: 'column',
      },
      spacing: {
        padding: '10px',
      },
    },
    key: 'MfcOBkWs',
    children: [
      {
        itemType: 'CONTAINER',
        css: {
          layout: {
            display: 'flex',
          },
          spacing: {
            padding: '6px',
          },
        },
        key: 'qqFDrdxw',
      },
      {
        itemType: 'CONTAINER',
        css: {
          layout: {
            display: 'flex',
          },
          flexboxGrid: {
            gap: '8px',
            flexDirection: 'row',
            flexWrap: 'wrap',
          },
          spacing: {
            padding: '5px',
          },
          sizing: {
            height: '100px',
          },
        },
        key: 'aBvkOlIv',
        children: [
          {
            itemType: 'CONTAINER',
            css: {
              layout: {
                display: 'flex',
              },
              flexboxGrid: {
                gap: '2px',
                flexGrow: 1,
              },
              spacing: {
                padding: '2px',
              },
            },
            key: 'MeRucrVe',
          },
          {
            itemType: 'CONTAINER',
            css: {
              layout: {
                display: 'flex',
              },
              flexboxGrid: {
                gap: '2px',
                flexWrap: 'nowrap',
                flexGrow: 2,
              },
              spacing: {
                padding: '2px',
              },
            },
            key: 'gqAngmoD',
          },
          {
            itemType: 'CONTAINER',
            css: {
              layout: {
                display: 'flex',
              },
              flexboxGrid: {
                gap: '2px',
                flexGrow: 1,
              },
              spacing: {
                padding: '2px',
              },
            },
            key: 'WjBxoHUn',
          },
        ],
      },
      {
        itemType: 'CONTAINER',
        css: {
          layout: {
            display: 'flex',
          },
          flexboxGrid: {
            gap: '2px',
          },
          spacing: {
            padding: '6px',
          },
        },
        key: 'buMSVyjs',
      },
    ],
  },
};
