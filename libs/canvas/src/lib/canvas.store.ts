import { Injectable } from '@angular/core';
import { Store } from '@layout/shared';
import { CanvasItem } from '@layout/models';
import cloneDeep from 'lodash.clonedeep';
import { CANVAS_ROOT_ELEMENT_ID } from './constants';
import { Css } from '@layout/models';
import { InsertPosition } from '@layout/models';

export class CanvasState {
  canvasItems: CanvasItem[] = [];
}

@Injectable()
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
      canvasItems: [...this.assignKeys(frames, false)],
    });
  }

  getItemById(
    frames: CanvasItem[] | undefined,
    key: string | undefined,
  ): CanvasItem | undefined {
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

  insertItem(
    referenceItemId: string,
    item: CanvasItem,
    insertPosition: InsertPosition,
  ): CanvasItem[] {
    const items = cloneDeep(this.items);
    this.assignKeys([item], true);

    switch (insertPosition) {
      case InsertPosition.INSIDE:
        this.insertInsideInArray(items, referenceItemId, item);
        break;
      case InsertPosition.AFTER:
        this.insertAfterInArray(items, referenceItemId, item);
        break;
      case InsertPosition.BEFORE:
        this.insertBeforeInArray(items, referenceItemId, item);
        break;
    }

    return items;
  }

  deleteItem(itemKey: string): CanvasItem[] {
    const items = cloneDeep(this.items);
    const parentItemKey = this.getParentItemKey(
      itemKey,
      items,
      CANVAS_ROOT_ELEMENT_ID,
    );

    let itemsToDeleteFrom: CanvasItem[] = [];
    if (parentItemKey === CANVAS_ROOT_ELEMENT_ID) {
      itemsToDeleteFrom = items;
    } else {
      const parentItem = this.getItemById(items, parentItemKey);
      if (parentItem) {
        itemsToDeleteFrom = parentItem.children || [];
      }
    }

    const index = itemsToDeleteFrom.findIndex((item) => item.key === itemKey);
    if (index > -1) {
      itemsToDeleteFrom.splice(index, 1);
    }

    return items;
  }

  updateItemCss(itemKey: string, css: Css): CanvasItem[] {
    const items = cloneDeep(this.items);
    const item = this.getItemById(items, itemKey);
    if (item) {
      item.css = css;
    }
    return items;
  }

  updateItemContent(itemKey: string, content: string): CanvasItem[] {
    const items = cloneDeep(this.items);
    const item = this.getItemById(items, itemKey);
    if (item) {
      item.content = content;
    }
    return items;
  }

  updateItemLabel(itemKey: string, label: string): CanvasItem[] {
    const items = cloneDeep(this.items);
    const item = this.getItemById(items, itemKey);
    if (item) {
      item.label = label;
    }
    return items;
  }

  removeItemAiMetadata(itemKey: string): CanvasItem[] {
    const items = cloneDeep(this.items);
    const item = this.getItemById(items, itemKey);
    if (item) {
      delete item.aiMetadata;
    }
    return items;
  }

  getParentItemKey(
    childKey: string,
    children: CanvasItem[],
    parentKey: string | undefined,
  ): string | undefined {
    for (const child of children) {
      if (child.key === childKey) {
        return parentKey;
      }

      if (child.children) {
        const parent = this.getParentItemKey(
          childKey,
          child.children,
          child.key,
        );
        if (parent) {
          return parent;
        }
      }
    }
    return undefined;
  }

  private insertInsideInArray(
    items: CanvasItem[],
    referenceItemId: string,
    item: CanvasItem,
  ) {
    const targetContainer = this.getItemById(items, referenceItemId);
    if (targetContainer) {
      targetContainer.children = targetContainer.children || [];
      targetContainer.children.push(item);
    }
  }

  private insertAfterInArray(
    items: CanvasItem[],
    referenceItemId: string,
    item: CanvasItem,
  ) {
    const parentFrameKey =
      this.getParentItemKey(referenceItemId, items, CANVAS_ROOT_ELEMENT_ID) ||
      CANVAS_ROOT_ELEMENT_ID;

    if (parentFrameKey === CANVAS_ROOT_ELEMENT_ID) {
      this.insertAtRootInArray(
        items,
        referenceItemId,
        item,
        InsertPosition.AFTER,
      );
    } else {
      this.insertInParentInArray(
        items,
        parentFrameKey,
        referenceItemId,
        item,
        false,
      );
    }
  }

  private insertBeforeInArray(
    items: CanvasItem[],
    referenceItemId: string,
    item: CanvasItem,
  ) {
    const parentFrameKey =
      this.getParentItemKey(referenceItemId, items, CANVAS_ROOT_ELEMENT_ID) ||
      CANVAS_ROOT_ELEMENT_ID;

    if (parentFrameKey === CANVAS_ROOT_ELEMENT_ID) {
      this.insertAtRootInArray(
        items,
        referenceItemId,
        item,
        InsertPosition.BEFORE,
      );
    } else {
      this.insertInParentInArray(
        items,
        parentFrameKey,
        referenceItemId,
        item,
        true,
      );
    }
  }

  private insertAtRootInArray(
    items: CanvasItem[],
    referenceItemId: string,
    item: CanvasItem,
    insertPosition: InsertPosition,
  ) {
    const referenceIndex = items.findIndex(
      (frame) => frame.key === referenceItemId,
    );
    let insertIndex;
    if (referenceIndex === -1) {
      insertIndex = insertPosition === InsertPosition.BEFORE ? 0 : items.length;
    } else {
      insertIndex =
        insertPosition === InsertPosition.BEFORE
          ? referenceIndex
          : referenceIndex + 1;
    }

    items.splice(insertIndex, 0, item);
  }

  private insertInParentInArray(
    items: CanvasItem[],
    parentFrameKey: string,
    referenceItemId: string,
    item: CanvasItem,
    before: boolean,
  ) {
    const parentItem = this.getItemById(items, parentFrameKey);
    if (parentItem) {
      parentItem.children = parentItem.children || [];
      const referenceIndex = parentItem.children.findIndex(
        (frame) => frame.key === referenceItemId,
      );
      parentItem.children.splice(
        before ? referenceIndex : referenceIndex + 1,
        0,
        item,
      );
    }
  }

  private getChildItemById(
    frames: CanvasItem[] | undefined,
    key: string | undefined,
  ): CanvasItem | undefined {
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

  private assignKeys(
    items: CanvasItem[] | undefined,
    overwriteExistingKeys: boolean,
  ) {
    if (!items) {
      return [];
    }

    items.forEach((frame) => {
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
