import {Injectable} from "@angular/core";
import {Store} from "./store";
import {CanvasItem} from "../models/canvas-item.model";
import cloneDeep from 'lodash.clonedeep';
import {CANVAS_WRAPPER_ID} from "../models/constants";
import {InsertPosition} from "../models/enums";

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
      canvasItems: [...this.assignKeys(frames, false)]
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

      const childFrame = this.getChildItemById(frame.children, key);
      if (childFrame) {
        return childFrame;
      }
    }

    return undefined;
  }

  insertItem(referenceItemId: string, item: CanvasItem, insertPosition: InsertPosition) {
    this.assignKeys([item], true);

    switch (insertPosition) {
      case InsertPosition.INSIDE:
        this.insertInside(referenceItemId, item);
        break;
      case InsertPosition.AFTER:
        this.insertAfter(referenceItemId, item);
        break;
      case InsertPosition.BEFORE:
        this.insertBefore(referenceItemId, item);
        break;
    }

    this.setItems(cloneDeep(this.getState().canvasItems));
  }

  getParentItemKey(childKey: string, children: CanvasItem[], parentKey: string | undefined): string | undefined {
    for (const child of children) {
      if (child.key === childKey) {
        return parentKey;
      }

      if (child.children) {
        const parent = this.getParentItemKey(childKey, child.children, child.key);
        if (parent) {
          return parent;
        }
      }
    }
    return undefined;
  }

  private insertInside(referenceItemId: string, item: CanvasItem) {
    const targetContainer = this.getItemById(this.items, referenceItemId);
    if (targetContainer) {
      targetContainer.children = targetContainer.children || [];
      targetContainer.children.push(item);
    }
  }

  private insertAfter(referenceItemId: string, item: CanvasItem) {
    const parentFrameKey = this.getParentItemKey(referenceItemId, this.items, CANVAS_WRAPPER_ID) || CANVAS_WRAPPER_ID;

    if (parentFrameKey === CANVAS_WRAPPER_ID) {
      this.insertAtRoot(referenceItemId, item, InsertPosition.AFTER);
    } else {
      this.insertInParent(parentFrameKey, referenceItemId, item, false);
    }
  }

  private insertBefore(referenceItemId: string, item: CanvasItem) {
    const parentFrameKey = this.getParentItemKey(referenceItemId, this.items, CANVAS_WRAPPER_ID) || CANVAS_WRAPPER_ID;

    if (parentFrameKey === CANVAS_WRAPPER_ID) {
      this.insertAtRoot(referenceItemId, item, InsertPosition.BEFORE);
    } else {
      this.insertInParent(parentFrameKey, referenceItemId, item, true);
    }
  }

  private insertAtRoot(referenceItemId: string, item: CanvasItem, insertPosition: InsertPosition) {
    const frames = this.items || [];
    const referenceIndex = frames.findIndex(frame => frame.key === referenceItemId);
    let insertIndex;
    if (referenceIndex === -1) {
      insertIndex = insertPosition === InsertPosition.BEFORE ? 0 : frames.length;
    } else {
      insertIndex = insertPosition === InsertPosition.BEFORE ? referenceIndex : referenceIndex + 1;
    }

    frames.splice(insertIndex, 0, item);
  }

  private insertInParent(parentFrameKey: string, referenceItemId: string, item: CanvasItem, before: boolean) {
    const parentItem = this.getItemById(undefined, parentFrameKey);
    if (parentItem) {
      parentItem.children = parentItem.children || [];
      const referenceIndex = parentItem.children.findIndex(frame => frame.key === referenceItemId);
      parentItem.children.splice(before ? referenceIndex : referenceIndex + 1, 0, item);
    }
  }

  private getChildItemById(frames: CanvasItem[] | undefined, key: string | undefined): CanvasItem | undefined {
    if (!frames || !frames.length || key == null) {
      return undefined;
    }

    for (const frame of frames) {
      if (frame.key === key) {
        return frame;
      }

      const childFrame = this.getChildItemById(frame.children, key);
      if (childFrame) {
        return childFrame;
      }
    }

    return undefined;
  }

  private assignKeys(items: CanvasItem[] | undefined, overwriteExistingKeys: boolean) {
    if (!items) {
      return [];
    }

    items.forEach(frame => {
      if (overwriteExistingKeys || (!overwriteExistingKeys && !frame.key)) {
        frame.key = this.generateUniqueId();
      }

      if (frame.children && frame.children.length > 0) {
        this.assignKeys(frame.children, overwriteExistingKeys);
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
