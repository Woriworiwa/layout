import { Preset, PresetCategory } from '@layout/models';

export const aiPreset: Preset = {
  presetId: 'ai-flex',
  presetName: 'Generate Layout',
  category: PresetCategory.ROOT,
  presetDefinition: {
    itemType: 'CONTAINER',
    label: 'AI Container',
    children: [],
    css: {
      layout: { display: 'flex' },
      flexboxGrid: { gap: '12px', flexDirection: 'column' },
      spacing: { padding: '16px' },
    },
    aiMetadata: {
      prompt: '',
      isGenerating: false,
    },
  },
};
