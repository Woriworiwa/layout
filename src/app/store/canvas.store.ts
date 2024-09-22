import {Injectable} from "@angular/core";
import {Store} from "./store";
import {CanvasItem} from "../models/canvas-item.model";
import cloneDeep from 'lodash.clonedeep';
import {CANVAS_WRAPPER_ID} from "../models/constants";

export class CanvasState {
  canvasItems: CanvasItem[] = [];
}

@Injectable({
  providedIn: 'root'
})
export class CanvasStore extends Store<CanvasState> {
  constructor() {
    super(new CanvasState());
  }

  get items() {
    return this.getState().canvasItems;
  }

  setItems(frames: CanvasItem[]) {
    this.setState({
      ...this.getState(),
      canvasItems: [...this.assignKeys(frames, undefined, false)]
    });
  }

  getItemById(frames: CanvasItem[] | undefined, key: string | undefined): CanvasItem | undefined {
    frames = frames || this.items;

    if (!frames || !frames.length || key == null) {
      return undefined;
    }

    for (const frame of frames) {
      if (frame.key === key) {
        return frame;
      }

      const childFrame = this.getChildFrameById(frame.children, key);
      if (childFrame) {
        return childFrame;
      }
    }

    return undefined;
  }

  getChildFrameById(frames: CanvasItem[] | undefined, key: string | undefined): CanvasItem | undefined {
    if (!frames || !frames.length || key == null) {
      return undefined;
    }

    for (const frame of frames) {
      if (frame.key === key) {
        return frame;
      }

      const childFrame = this.getChildFrameById(frame.children, key);
      if (childFrame) {
        return childFrame;
      }
    }

    return undefined;
  }

  insertItem(insertAfterItemId: string, item: CanvasItem) {
    this.assignKeys([item], undefined, true);

    const parentFrameKey = this.getParentItemKey(insertAfterItemId, this.items, CANVAS_WRAPPER_ID) || CANVAS_WRAPPER_ID;

    if (parentFrameKey === CANVAS_WRAPPER_ID) {
      const frames = this.items || [];
      if (!insertAfterItemId || insertAfterItemId === CANVAS_WRAPPER_ID) {
        frames.push(item);
      } else {
        const insertAfterFrameIndex = this.items.findIndex(frame => frame.key === insertAfterItemId);
        frames.splice(insertAfterFrameIndex + 1, 0, item);
      }
    } else {
      const parentItem = this.getItemById(undefined, parentFrameKey);
      if (!parentItem) {
        return;
      }

      if (!parentItem?.children) {
        parentItem.children = [];
      }

      parentItem?.children?.splice(parentItem.children.findIndex(frame => frame.key === insertAfterItemId) + 1, 0, item);
    }

    this.setItems(cloneDeep(this.getState().canvasItems));
  }

  getParentItemKey(childKey: string, frames: CanvasItem[], parentKey: string | undefined): string | undefined {
    for (const item of frames) {
      if (item.key === childKey) {
        return parentKey;
      }

      if (item.children) {
        for (const child of item.children) {
          if (child.key === childKey) {
            return item.key;
          } else if (child.children) {
            const parent = this.getParentItemKey(childKey, child.children, child.key);
            if (parent) {
              return parent;
            }
          }
        }
      }
    }
    return undefined;
  }

  private assignKeys(items: CanvasItem[] | undefined, parentKey: string | undefined, overwriteExistingKeys: boolean) {
    if (!items) {
      return [];
    }

    items.forEach(frame => {
      if (overwriteExistingKeys || (!overwriteExistingKeys && !frame.key)) {
        frame.key = this.generateUniqueId();
      }

      if (frame.children && frame.children.length > 0) {
        this.assignKeys(frame.children, frame.key, overwriteExistingKeys);
      }
    });

    return items;
  }

  private generateUniqueId(): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    let uniqueId = '';

    for (let i = 0; i < 8; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      uniqueId += characters.charAt(randomIndex);
    }

    return uniqueId;
  }
}
