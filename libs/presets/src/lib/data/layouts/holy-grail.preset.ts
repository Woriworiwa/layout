import { PresetCategory } from '@layout/models';

export const holyGrailPreset = {
  presetId: 'holy-grail',
  presetName: 'Holy grail layout',
  category: PresetCategory.LAYOUTS,
  presetDefinition: {
    itemType: 'CONTAINER',
    css: {
      display: {
        display: 'flex',
      },
      container: {
        gap: '8',
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
          display: {
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
          display: {
            display: 'flex',
          },
          container: {
            gap: 8,
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
              display: {
                display: 'flex',
              },
              container: {
                gap: 2,
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
              display: {
                display: 'flex',
              },
              container: {
                gap: '2',
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
              display: {
                display: 'flex',
              },
              container: {
                gap: 2,
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
          display: {
            display: 'flex',
          },
          container: {
            gap: 2,
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
