import { PresetCategory } from '../../app/core/models/preset.model';

export const textPresets = [
  {
    presetId: 'text',
    presetName: 'Text',
    category: PresetCategory.ROOT,
    presetDefinition: {
      itemType: 'TEXT',
      content: 'dbl click to edit',
    },
  },
];
