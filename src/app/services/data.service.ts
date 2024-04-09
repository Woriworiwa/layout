import {Frame} from "../models/frame.model";
import {Injectable} from "@angular/core";
import {mockData} from "../models/data/mock-data";
import {flexPresets, textPresets} from "../models/data/presets";
import {Preset} from "../models/preset.model";
import cloneDeep from "lodash.clonedeep";


@Injectable()
export class DataService {
  getInitialData() {
    const frames: Frame[] = mockData as Frame[];
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
