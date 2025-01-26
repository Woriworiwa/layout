import {Injectable} from "@angular/core";
import {CanvasItem} from "../../core/models/canvas-item.model";
import {CanvasItemType} from "../../core/enums";
import {flexPresets, textPresets} from "../../../assets/data/presets";
import {Preset} from "../../core/models/preset.model";
import {PresetContainerComponent} from "./preset-container.component";
import {PresetTextComponent} from "./preset-text.component";


import {BoxSizing} from "../../core/models/css/box-sizing";

@Injectable()
export class PresetsService {
  defaultPadding = '16px';

  getPresetComponents() {
    return [...textPresets, ...flexPresets].map(preset => {
      return {
        preset: preset,
        component: this.getPresetComponent(preset.presetDefinition.itemType as CanvasItemType),
        inputs: { preset: preset.presetDefinition }
      }
    });
  }

  getPresetComponent(type: CanvasItemType) {
    switch (type) {
      case CanvasItemType.FLEX:
        return PresetContainerComponent;
      case CanvasItemType.TEXT:
        return PresetTextComponent;
      default:
        return PresetContainerComponent;
    }
  }

  getPresets() {
    return [...flexPresets as Preset[], ...textPresets as Preset[]]
  }

  getPreset(presetId: string) {
    return this.getPresets().find(preset => preset.presetId === presetId);
  }

  assignDefaultPaddings(newItem: CanvasItem) {
    if (newItem.itemType === CanvasItemType.FLEX) {
      const boxSizing: BoxSizing = {
        ...newItem.css?.boxSizing,
        padding: this.defaultPadding
      }
      newItem.css = {
        ...newItem.css,
        boxSizing
      }
    }

    newItem.children?.forEach(frame => {
      this.assignDefaultPaddings(frame);
    });
  }
}
