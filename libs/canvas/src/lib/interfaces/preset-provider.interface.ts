import { CanvasItem } from '../models/canvas-item.model';

export interface PresetProvider {
  getPreset(presetId: string): { presetId: string; presetDefinition: CanvasItem } | undefined;
  assignDefaultPaddings(item: CanvasItem): void;
}
