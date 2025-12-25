export const aiPreset = {
  presetId: 'ai-flex',
  presetName: 'AI Layout',
  presetDefinition: {
    itemType: 'CONTAINER',
    label: 'AI Container',
    children: [],
    css: {
      display: { display: 'flex' },
      container: { gap: '12' },
      flexContainer: { flexDirection: 'column' },
      boxSizing: { padding: '16px' },
    },
    aiMetadata: {
      prompt: '',
      isGenerating: false,
    },
  },
};
