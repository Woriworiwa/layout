import { Preset, PresetCategory } from '@layout/models';

export const textPreset: Preset = {
  presetId: 'text',
  presetName: 'Text',
  category: PresetCategory.ROOT,
  presetDefinition: {
    itemType: 'TEXT',
    content: 'dbl click to edit',
  },
};
