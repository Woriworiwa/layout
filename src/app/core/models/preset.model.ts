import { CanvasItem } from './canvas-item.model';

export interface Preset {
  presetId: string;
  presetName: string;
  presetDefinition: CanvasItem;
}
