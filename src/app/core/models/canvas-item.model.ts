import {CanvasItemType} from "../enums";
import {Css} from "./css/css";

export interface CanvasItem {
  itemType: CanvasItemType;
  key?: string;
  label?: string;
  content?: string;
  children?: CanvasItem[];
  css?: Css;
  editable?: boolean;
}







