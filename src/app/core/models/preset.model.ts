import { CanvasItem } from '@layout/canvas';

export interface Preset {
  presetId: string;
  presetName: string;
  presetDefinition: CanvasItem;
}
