import {Injectable} from "@angular/core";
import {CanvasItem} from "../models/canvas-item.model";
import {CanvasItemType} from "../models/enums";
import {BoxSizing} from "../models/css.model";
import {flexPresets, textPresets} from "../data/presets";
import {Preset} from "../models/preset.model";

@Injectable()
export class PresetsService {
  defaultPadding = '16';

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
