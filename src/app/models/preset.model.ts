import {Frame} from "./frame.model";

export interface Preset {
  presetId: string;
  presetName: string;
  presetDefinition: Frame;
}
