export const basicGridPresets = [
  {
    presetId: 'empty-grid',
    presetName: 'Empty Grid',
    presetDefinition: {
      itemType: 'CONTAINER',
      css: {
        display: {
          display: 'grid',
        },
        gridContainer: {
          gridTemplateColumns: '1fr',
        },
        boxSizing: {
          padding: '18px',
        },
      },
    },
  },
  {
    presetId: 'grid-2x2',
    presetName: 'Grid 2x2',
    presetDefinition: {
      itemType: 'CONTAINER',
      css: {
        display: {
          display: 'grid',
        },
        container: {
          gap: 10,
        },
        gridContainer: {
          gridTemplateColumns: '1fr 1fr',
          gridTemplateRows: '1fr 1fr',
        },
        boxSizing: {
          padding: '18px',
        },
      },
      children: [
        {
          content: '1',
          itemType: 'TEXT',
        },
        {
          content: '2',
          itemType: 'TEXT',
        },
        {
          content: '3',
          itemType: 'TEXT',
        },
        {
          content: '4',
          itemType: 'TEXT',
        },
      ],
    },
  },
  {
    presetId: 'grid-3-columns',
    presetName: 'Grid 3 Columns',
    presetDefinition: {
      itemType: 'CONTAINER',
      css: {
        display: {
          display: 'grid',
        },
        container: {
          gap: 10,
        },
        gridContainer: {
          gridTemplateColumns: 'repeat(3, 1fr)',
        },
        boxSizing: {
          padding: '18px',
        },
      },
      children: [
        {
          content: 'Card 1',
          itemType: 'TEXT',
          css: {
            boxSizing: {
              padding: '12px',
            },
          },
        },
        {
          content: 'Card 2',
          itemType: 'TEXT',
          css: {
            boxSizing: {
              padding: '12px',
            },
          },
        },
        {
          content: 'Card 3',
          itemType: 'TEXT',
          css: {
            boxSizing: {
              padding: '12px',
            },
          },
        },
      ],
    },
  },
  {
    presetId: 'grid-auto-fit',
    presetName: 'Grid Auto-Fit',
    presetDefinition: {
      itemType: 'CONTAINER',
      css: {
        display: {
          display: 'grid',
        },
        container: {
          gap: 10,
        },
        gridContainer: {
          gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
        },
        boxSizing: {
          padding: '18px',
        },
      },
      children: [
        {
          content: 'Responsive 1',
          itemType: 'TEXT',
          css: {
            boxSizing: {
              padding: '12px',
            },
          },
        },
        {
          content: 'Responsive 2',
          itemType: 'TEXT',
          css: {
            boxSizing: {
              padding: '12px',
            },
          },
        },
        {
          content: 'Responsive 3',
          itemType: 'TEXT',
          css: {
            boxSizing: {
              padding: '12px',
            },
          },
        },
      ],
    },
  },
];
