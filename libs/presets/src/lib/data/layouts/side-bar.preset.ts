import { PresetCategory } from '@layout/models';

export const sideBarPreset = {
  presetId: 'sidebar-layout',
  presetName: 'Sidebar layout',
  category: PresetCategory.LAYOUTS,
  presetDefinition: {
    itemType: 'CONTAINER',
    css: {
      display: {
        display: 'flex',
      },
      container: {
        gap: '16',
      },
      boxSizing: {
        padding: '16px',
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
            gap: '8',
          },
          flexContainer: {
            flexDirection: 'column',
          },
          boxSizing: {
            padding: '16px',
          },
          flexItem: {
            flexGrow: 1,
          },
        },
        children: [
          {
            content: 'Menu Item 1',
            itemType: 'TEXT',
            key: 'RCCkhojB',
          },
          {
            content: 'Menu Item 2',
            itemType: 'TEXT',
            key: 'SWDyLSrL',
          },
        ],
        label: 'Sidebar',
        key: 'hUqwWlBL',
      },
      {
        itemType: 'CONTAINER',
        css: {
          display: {
            display: 'flex',
          },
          flexItem: {
            flexGrow: 4,
          },
          boxSizing: {
            height: '178px',
            padding: '16px',
          },
          flexContainer: {
            flexDirection: 'column',
          },
        },
        children: [
          {
            content: 'Main content area',
            itemType: 'TEXT',
            key: 'sDByCduE',
            css: {
              flexItem: {
                flexGrow: 1,
              },
            },
          },
        ],
        label: 'Content',
        key: 'HyjMXQkI',
      },
    ],
    key: 'YAKaghwj',
  },
};
