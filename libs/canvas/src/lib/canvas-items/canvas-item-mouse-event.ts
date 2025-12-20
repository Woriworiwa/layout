import { CanvasItem } from '../models/canvas-item.model';

export type CanvasItemMouseEvent = {
  canvasItem: CanvasItem;
  mouseEvent: MouseEvent;
};
