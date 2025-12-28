import { PresetCategory } from '../../app/core/models/preset.model';

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
      },
      flexContainer: {
        flexDirection: 'column',
      },
      boxSizing: {
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
          boxSizing: {
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
          },
          flexContainer: {
            flexDirection: 'row',
            flexWrap: 'wrap',
          },
          boxSizing: {
            padding: '5px',
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
              },
              boxSizing: {
                padding: '2px',
              },
              flexItem: {
                flexGrow: 1,
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
              },
              flexContainer: {
                flexWrap: 'nowrap',
              },
              boxSizing: {
                padding: '2px',
              },
              flexItem: {
                flexGrow: 2,
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
              },
              boxSizing: {
                padding: '2px',
              },
              flexItem: {
                flexGrow: 1,
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
          boxSizing: {
            padding: '6px',
          },
        },
        key: 'buMSVyjs',
      },
    ],
  },
};
