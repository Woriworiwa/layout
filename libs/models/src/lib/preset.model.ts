import { CanvasItem } from '@layout/models';

export enum PresetCategory {
  ROOT = 'root',
  FLEXBOX = 'flexbox',
  GRID = 'grid',
  LAYOUTS = 'layouts',
  COMPONENTS = 'components',
}

export interface Preset {
  presetId: string;
  presetName: string;
  presetDefinition: CanvasItem;
  category?: PresetCategory;
}

export interface PresetFolder {
  id: PresetCategory;
  label: string;
  icon?: string;
  presets: Preset[];
}

export interface PresetFolderState {
  [key: string]: boolean;
}
