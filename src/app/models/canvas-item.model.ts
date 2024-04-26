import {CanvasItemType} from "./enums";
import {Css} from "./css.model";

export interface CanvasItem {
  key?: string;
  label?: string;
  itemType: CanvasItemType;
  children?: CanvasItem[];
  css?: Css;
  editable?: boolean;
}

export type CanvasItemMouseEvent = {canvasItem: CanvasItem, mouseEvent: MouseEvent};







