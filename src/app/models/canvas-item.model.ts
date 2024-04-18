import {FrameType} from "./enums";
import {Css} from "./css.model";

export interface CanvasItem {
  key?: string;
  name?: string;
  frameType: FrameType;
  children?: CanvasItem[];
  css?: Css;
  editable?: boolean;
}









