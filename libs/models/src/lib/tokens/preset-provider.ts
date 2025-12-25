import { InjectionToken } from '@angular/core';
import { CanvasItem } from '../canvas-item.model';

export interface PresetProvider {
  getPreset(
    presetId: string,
  ): { presetId: string; presetDefinition: CanvasItem } | undefined;
  assignDefaultPaddings(item: CanvasItem): void;
}

export const PRESET_PROVIDER = new InjectionToken<PresetProvider>(
  'PRESET_PROVIDER',
);
