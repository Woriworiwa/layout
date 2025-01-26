import {CanvasItemType} from "./enums";
import {Css} from "./css.model";

export interface CanvasItem {
  itemType: CanvasItemType;
  key?: string;
  label?: string;
  content?: string;
  children?: CanvasItem[];
  css?: Css;
  editable?: boolean;
}

export type CanvasItemMouseEvent = {canvasItem: CanvasItem, mouseEvent: MouseEvent};







