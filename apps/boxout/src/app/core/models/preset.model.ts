import { CanvasItem } from '@layout/models';

export interface Preset {
  presetId: string;
  presetName: string;
  presetDefinition: CanvasItem;
}
