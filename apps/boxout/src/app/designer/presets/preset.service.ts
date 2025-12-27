import { Injectable } from '@angular/core';
import { CanvasItem, CanvasItemType, BoxSizing } from '@layout/models';
import { PresetProvider } from '@layout/shared';
import { allPresets } from '../../../data/presets';
import { Preset } from '../../core/models/preset.model';
import { PresetContainerComponent } from './preset-container.component';
import { PresetTextComponent } from './preset-text.component';
import { PresetAiComponent } from './preset-ai.component';

@Injectable()
export class PresetService implements PresetProvider {
  defaultPadding = '16px';
  allPresets: Preset[] = [...allPresets] as Preset[];

  getAssetComponents() {
    return this.allPresets.map((preset) => {
      // Use PresetAiComponent for AI presets
      const component = preset.presetDefinition.aiMetadata
        ? PresetAiComponent
        : this.getAssetComponent(
            preset.presetDefinition.itemType as CanvasItemType,
          );

      return {
        preset: preset,
        component: component,
        inputs: { preset: preset.presetDefinition },
      };
    });
  }

  getAssetComponent(type: CanvasItemType) {
    switch (type) {
      case CanvasItemType.CONTAINER:
        return PresetContainerComponent;
      case CanvasItemType.TEXT:
        return PresetTextComponent;
      default:
        return PresetContainerComponent;
    }
  }

  getPreset(presetId: string) {
    return this.allPresets.find((preset) => preset.presetId === presetId);
  }

  assignDefaultPaddings(newItem: CanvasItem) {
    if (newItem.itemType === CanvasItemType.CONTAINER) {
      const boxSizing: BoxSizing = {
        ...newItem.css?.boxSizing,
        padding: this.defaultPadding,
      };
      newItem.css = {
        ...newItem.css,
        boxSizing,
      };
    }

    newItem.children?.forEach((frame) => {
      this.assignDefaultPaddings(frame);
    });
  }
}
