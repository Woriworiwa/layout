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
      spacing: {
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
            flexDirection: 'column',
            flexGrow: 1,
          },
          spacing: {
            padding: '16px',
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
          container: {
            flexDirection: 'column',
            flexGrow: 4,
          },
          spacing: {
            padding: '16px',
          },
          sizing: {
            height: '178px',
          },
        },
        children: [
          {
            content: 'Main content area',
            itemType: 'TEXT',
            key: 'sDByCduE',
            css: {
              container: {
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
