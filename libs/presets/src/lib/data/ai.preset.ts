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
      layout: { display: 'flex' },
      flexboxGrid: { gap: '12', flexDirection: 'column' },
      spacing: { padding: '16px' },
    },
    aiMetadata: {
      prompt: '',
      isGenerating: false,
    },
  },
};
