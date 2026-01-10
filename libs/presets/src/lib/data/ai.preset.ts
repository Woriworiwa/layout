import { PresetCategory } from '@layout/models';

export const aiPreset = {
  presetId: 'ai-flex',
  presetName: 'Generate Layout',
  category: PresetCategory.ROOT,
  presetDefinition: {
    itemType: 'CONTAINER',
    label: 'AI Container',
    children: [],
    css: {
      display: { display: 'flex' },
      container: { gap: '12', flexDirection: 'column' },
      boxSizing: { padding: '16px' },
    },
    aiMetadata: {
      prompt: '',
      isGenerating: false,
    },
  },
};
