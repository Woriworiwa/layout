import {CanvasItem} from "../models/canvas-item.model";
import {Injectable} from "@angular/core";
import {mockData} from "../data/mock-data";
import {flexPresets, textPresets} from "../data/presets";
import {Preset} from "../models/preset.model";

@Injectable()
export class DataService {
  getInitialData() {
    const frames: CanvasItem[] = mockData as CanvasItem[];
    return frames;
  }

  getPresets() {
    const presets: Preset[] = [...flexPresets as Preset[], ...textPresets as Preset[]]

    return presets;
  }

  getPreset(presetId: string) {
    return this.getPresets().find(preset => preset.presetId === presetId);
  }

}
