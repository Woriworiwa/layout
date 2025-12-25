import { CanvasItem } from '@layout/models';

export interface PresetProvider {
  getPreset(
    presetId: string,
  ): { presetId: string; presetDefinition: CanvasItem } | undefined;
  assignDefaultPaddings(item: CanvasItem): void;
}
