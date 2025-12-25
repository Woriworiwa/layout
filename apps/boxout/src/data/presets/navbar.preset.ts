export const navbarPreset = {
  presetId: 'navbar',
  presetName: 'Navigation bar',
  presetDefinition: {
    itemType: 'CONTAINER',
    css: {
      display: {
        display: 'flex',
      },
      container: {
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '16',
      },
      flexContainer: {
        flexDirection: 'row',
      },
      boxSizing: {
        padding: '12px 20px',
      },
    },
    children: [
      {
        content: 'Logo',
        itemType: 'TEXT',
        css: {
          typography: {
            fontSize: '20px',
            fontWeight: 'bold',
          },
        },
      },
      {
        itemType: 'CONTAINER',
        css: {
          display: {
            display: 'flex',
          },
          container: {
            gap: '20',
          },
        },
        children: [
          {
            content: 'Home',
            itemType: 'TEXT',
          },
          {
            content: 'About',
            itemType: 'TEXT',
          },
          {
            content: 'Contact',
            itemType: 'TEXT',
          },
        ],
      },
    ],
  },
};
