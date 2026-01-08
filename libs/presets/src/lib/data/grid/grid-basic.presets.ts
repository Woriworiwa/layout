import { PresetCategory } from '@layout/models';

export const basicGridPresets = [
  {
    presetId: 'empty-grid',
    presetName: 'Empty Grid',
    category: PresetCategory.GRID,
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
    category: PresetCategory.GRID,
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
    category: PresetCategory.GRID,
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
    category: PresetCategory.GRID,
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
  {
    presetId: 'grid-template-areas-blog',
    presetName: 'Grid Areas - Blog Layout',
    category: PresetCategory.GRID,
    presetDefinition: {
      itemType: 'CONTAINER',
      css: {
        display: {
          display: 'grid',
        },
        container: {
          gap: 12,
        },
        gridContainer: {
          gridTemplateColumns: '1fr 3fr',
          gridTemplateRows: 'auto 1fr auto',
          gridTemplateAreas: '"header header"\n"sidebar content"\n"footer footer"',
        },
        boxSizing: {
          padding: '18px',
        },
      },
      children: [
        {
          content: 'Header',
          itemType: 'TEXT',
          css: {
            gridItem: {
              gridArea: 'header',
            },
            boxSizing: {
              padding: '12px',
            },
          },
        },
        {
          content: 'Sidebar',
          itemType: 'TEXT',
          css: {
            gridItem: {
              gridArea: 'sidebar',
            },
            boxSizing: {
              padding: '12px',
            },
          },
        },
        {
          content: 'Content',
          itemType: 'TEXT',
          css: {
            gridItem: {
              gridArea: 'content',
            },
            boxSizing: {
              padding: '12px',
            },
          },
        },
        {
          content: 'Footer',
          itemType: 'TEXT',
          css: {
            gridItem: {
              gridArea: 'footer',
            },
            boxSizing: {
              padding: '12px',
            },
          },
        },
      ],
    },
  },
  {
    presetId: 'grid-subgrid',
    presetName: 'CSS Subgrid - Card Grid',
    category: PresetCategory.GRID,
    presetDefinition: {
      itemType: 'CONTAINER',
      css: {
        display: {
          display: 'grid',
        },
        container: {
          gap: 16,
        },
        gridContainer: {
          gridTemplateColumns: 'repeat(3, 1fr)',
          gridTemplateRows: 'auto 1fr auto',
        },
        boxSizing: {
          padding: '18px',
        },
      },
      children: [
        {
          itemType: 'CONTAINER',
          label: 'Card 1',
          css: {
            display: {
              display: 'grid',
            },
            gridContainer: {
              gridTemplateRows: 'subgrid',
            },
            gridItem: {
              gridRow: '1 / 4',
            },
            container: {
              gap: 12,
            },
            boxSizing: {
              padding: '16px',
            },
          },
          children: [
            {
              content: 'Product Title',
              itemType: 'TEXT',
              css: {
                boxSizing: {
                  padding: '4px',
                },
              },
            },
            {
              content: 'Short description of the product features.',
              itemType: 'TEXT',
              css: {
                boxSizing: {
                  padding: '4px',
                },
              },
            },
            {
              content: 'Buy Now',
              itemType: 'TEXT',
              css: {
                boxSizing: {
                  padding: '8px',
                },
              },
            },
          ],
        },
        {
          itemType: 'CONTAINER',
          label: 'Card 2',
          css: {
            display: {
              display: 'grid',
            },
            gridContainer: {
              gridTemplateRows: 'subgrid',
            },
            gridItem: {
              gridRow: '1 / 4',
            },
            container: {
              gap: 12,
            },
            boxSizing: {
              padding: '16px',
            },
          },
          children: [
            {
              content: 'Another Product',
              itemType: 'TEXT',
              css: {
                boxSizing: {
                  padding: '4px',
                },
              },
            },
            {
              content: 'This has a much longer description that explains features in detail. Notice how buttons still align.',
              itemType: 'TEXT',
              css: {
                boxSizing: {
                  padding: '4px',
                },
              },
            },
            {
              content: 'Buy Now',
              itemType: 'TEXT',
              css: {
                boxSizing: {
                  padding: '8px',
                },
              },
            },
          ],
        },
        {
          itemType: 'CONTAINER',
          label: 'Card 3',
          css: {
            display: {
              display: 'grid',
            },
            gridContainer: {
              gridTemplateRows: 'subgrid',
            },
            gridItem: {
              gridRow: '1 / 4',
            },
            container: {
              gap: 12,
            },
            boxSizing: {
              padding: '16px',
            },
          },
          children: [
            {
              content: 'Premium Item',
              itemType: 'TEXT',
              css: {
                boxSizing: {
                  padding: '4px',
                },
              },
            },
            {
              content: 'Medium length description here.',
              itemType: 'TEXT',
              css: {
                boxSizing: {
                  padding: '4px',
                },
              },
            },
            {
              content: 'Buy Now',
              itemType: 'TEXT',
              css: {
                boxSizing: {
                  padding: '8px',
                },
              },
            },
          ],
        },
      ],
    },
  },
];
