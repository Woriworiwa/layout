export const justifyContentGuidePreset = {
  presetId: 'guide-justify-content',
  presetName: 'Guide: Justify Content',
  presetDefinition: {
    itemType: 'CONTAINER',
    label: 'AI Container',
    children: [
      {
        itemType: 'TEXT',
        label: 'Intro Explanation',
        content:
          "The 'justify-content' property aligns flex items along the main axis of the flex container. Its behavior depends on the 'flex-direction' of the container. Use the right-side panel to change the 'justifyContent' property of the 'Interactive Example' containers below and observe how the items are distributed.\n\n\nWhen 'flex-direction' is 'row', 'justify-content' distributes items horizontally along the main axis. The cross axis is vertical (determined by 'align-items').\n\n\nWhen 'flex-direction' is 'column', 'justify-content' distributes items vertically along the main axis. The cross axis is horizontal. Note: the container must have a defined 'height' for this property to have a visible effect.",
        key: 'TPawiCWX',
        children: [],
      },
      {
        itemType: 'CONTAINER',
        label: 'Column Direction Section',
        css: {
          display: {
            display: 'flex',
          },
          flexboxGrid: {
            flexDirection: 'row',
            gap: '16',
            justifyContent: 'start',
            alignItems: 'center',
            flexGrow: 1,
          },
          spacing: {
            padding: '16px',
          },
        },
        children: [
          {
            itemType: 'CONTAINER',
            label: 'Interactive Row Example Container',
            css: {
              display: {
                display: 'flex',
              },
              flexboxGrid: {
                flexDirection: 'row',
                gap: '8',
                justifyContent: 'space-evenly',
                alignItems: 'center',
              },
              spacing: {
                padding: '16px',
              },
              sizing: {
                width: '100%',
                height: '80px',
              },
            },
            children: [
              {
                itemType: 'TEXT',
                label: 'Row Item 1',
                content: 'Item 1',
                css: {
                  spacing: {
                    padding: '8px',
                  },
                  sizing: {
                    width: '60px',
                    height: '40px',
                  },
                },
                key: 'hSVqzRjA',
                children: [],
              },
              {
                itemType: 'TEXT',
                label: 'Row Item 2',
                content: 'Item 2',
                css: {
                  spacing: {
                    padding: '8px',
                  },
                  sizing: {
                    width: '60px',
                    height: '40px',
                  },
                },
                key: 'yxnYjIPo',
                children: [],
              },
              {
                itemType: 'TEXT',
                label: 'Row Item 3',
                content: 'Item 3',
                css: {
                  spacing: {
                    padding: '8px',
                  },
                  sizing: {
                    width: '60px',
                    height: '40px',
                  },
                },
                key: 'CZVeexPW',
                children: [],
              },
            ],
            key: 'VTCbZNWE',
          },
          {
            itemType: 'CONTAINER',
            label: 'Interactive Column Example Container',
            css: {
              display: {
                display: 'flex',
              },
              flexboxGrid: {
                flexDirection: 'column',
                gap: '8',
                justifyContent: 'end',
                alignItems: 'center',
              },
              spacing: {
                padding: '16px',
              },
              sizing: {
                width: '150px',
                height: '250px',
              },
            },
            children: [
              {
                itemType: 'TEXT',
                label: 'Column Item A',
                content: 'Item A',
                css: {
                  spacing: {
                    padding: '8px',
                  },
                  sizing: {
                    width: '80px',
                    height: '40px',
                  },
                },
                key: 'YJZLmoYA',
                children: [],
              },
              {
                itemType: 'TEXT',
                label: 'Column Item B',
                content: 'Item B',
                css: {
                  spacing: {
                    padding: '8px',
                  },
                  sizing: {
                    width: '80px',
                    height: '40px',
                  },
                },
                key: 'jmayveFm',
                children: [],
              },
              {
                itemType: 'TEXT',
                label: 'Column Item C',
                content: 'Item C',
                css: {
                  spacing: {
                    padding: '8px',
                  },
                  sizing: {
                    width: '80px',
                    height: '40px',
                  },
                },
                key: 'VqQMEWgW',
                children: [],
              },
            ],
            key: 'aMNlHkCy',
          },
        ],
        key: 'OnmITMXJ',
      },
    ],
    css: {
      display: {
        display: 'flex',
      },
      flexboxGrid: {
        flexDirection: 'column',
        gap: '12',
      },
      spacing: {
        padding: '16px',
      },
    },
    key: 'qfxxebxz',
  },
};
