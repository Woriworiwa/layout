export const flexGrowShrinkPreset = [
  {
    presetId: 'flex-grow-shrink',
    presetName: 'Flex grow & shrink',
    presetDefinition: {
      itemType: 'FLEX',
      css: {
        display: {
          display: 'flex',
        },
        container: {
          gap: '12',
        },
        boxSizing: {
          padding: '16px',
          width: '100%',
        },
      },
      children: [
        {
          itemType: 'FLEX',
          css: {
            display: {
              display: 'flex',
            },
            container: {
              justifyContent: 'center',
              alignItems: 'center',
            },
            boxSizing: {
              padding: '20px',
              width: '100px',
            },
            flexItem: {
              flexShrink: 0,
            },
          },
          children: [
            {
              content: 'Fixed',
              itemType: 'TEXT',
              css: {
                typography: {
                  fontSize: '12px',
                },
              },
            },
          ],
          label: 'flex-shrink: 0',
        },
        {
          itemType: 'FLEX',
          css: {
            display: {
              display: 'flex',
            },
            container: {
              justifyContent: 'center',
              alignItems: 'center',
            },
            boxSizing: {
              padding: '20px',
            },
            flexItem: {
              flexGrow: 1,
            },
          },
          children: [
            {
              content: 'Grows',
              itemType: 'TEXT',
              css: {
                typography: {
                  fontSize: '12px',
                },
              },
            },
          ],
          label: 'flex-grow: 1',
        },
        {
          itemType: 'FLEX',
          css: {
            display: {
              display: 'flex',
            },
            container: {
              justifyContent: 'center',
              alignItems: 'center',
            },
            boxSizing: {
              padding: '20px',
            },
            flexItem: {
              flexGrow: 2,
            },
          },
          children: [
            {
              content: 'Grows 2x',
              itemType: 'TEXT',
              css: {
                typography: {
                  fontSize: '12px',
                },
              },
            },
          ],
          label: 'flex-grow: 2',
        },
      ],
    },
  },
];
