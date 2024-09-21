import {Injectable} from "@angular/core";
import {Store} from "./store";
import {CanvasItem} from "../models/canvas-item.model";
import cloneDeep from 'lodash.clonedeep';
import {distinctUntilChanged, map, Subject} from "rxjs";
import {CanvasItemType} from "../models/enums";
import {CANVAS_WRAPPER_ID} from "../models/constants";
import {moveItemInArray, transferArrayItem} from "@angular/cdk/drag-drop";
import {Css} from "../models/css.model";
import {UndoRedoService} from "../services/undo-redo.service";
import {PresetsService} from "../services/presets.service";

export class CanvasState {
  canvasItems: CanvasItem[] = [];
  selectedItemKey: string | undefined;
  hoverItemKey: string | undefined;
}

@Injectable({
  providedIn: 'root'
})
export class CanvasStore extends Store<CanvasState> {
  private cssChangedSubject = new Subject();
  cssChanged$ = this.cssChangedSubject.asObservable();

  constructor(private undoRedoService: UndoRedoService,
              private presetsService: PresetsService) {
    super(new CanvasState());

    this.undoRedoService.data$.subscribe((currentState: CanvasItem[]) => {
      this.setCanvasItems(currentState, false);
    })
  }

  get canvasItems$() {
    return this.state.pipe(
      map(state => state.canvasItems),
      distinctUntilChanged()
    )
  }

  get canvasItems() {
    return this.getState().canvasItems;
  }

  setCanvasItems(frames: CanvasItem[], pushToUndoStack = true) {
    this.setState({
      ...this.getState(),
      canvasItems: [...this.assignKeys(frames, undefined, false)]
    });

    if (pushToUndoStack) {
      this.undoRedoService.pushUndoStack(cloneDeep(this.getState().canvasItems));
    }
  }

  get selectedCanvasItem$() {
    return this.state.pipe(
      map(state => state.selectedItemKey),
      distinctUntilChanged(),
      map(selectedItemKey => this.getItemById(this.getState().canvasItems, selectedItemKey))
    );
  }

  //TODO: change to getter to match the above properties
  selectedCanvasItem() {
    return this.getItemById(this.getState().canvasItems, this.getState().selectedItemKey);
  }

  setSelectedCanvasItemKey(key: string | undefined) {
    this.setState({
      ...this.getState(),
      selectedItemKey: key
    })
  }

  get hoverCanvasItem$() {
    return this.state.pipe(
      map(state => state.hoverItemKey),
      distinctUntilChanged(),
      map(hoverItemKey => this.getItemById(this.getState().canvasItems, hoverItemKey))
    );
  }

  setHoverItemKey(key: string | undefined) {
    this.setState({
      ...this.getState(),
      hoverItemKey: key
    })
  }

  addNewPreset(presetId: string, insertAfterItemId: string) {
    const preset = this.presetsService.getPreset(presetId);

    if (!preset) {
      return;
    }

    const newItem = cloneDeep(preset.presetDefinition);
    this.assignKeys([newItem], undefined, false);
    this.presetsService.assignDefaultPaddings(newItem);
    this.insertItem(insertAfterItemId, newItem);
  }

  deleteCanvasItem(itemId: string | undefined) {
    if (!itemId) {
      return;
    }

    const parentItemKey = this.getParentItemKey(itemId, this.canvasItems, CANVAS_WRAPPER_ID);
    let items: CanvasItem[] = []
    if (parentItemKey === CANVAS_WRAPPER_ID) {
      items = this.canvasItems;
    } else {
      const parentItem = this.getItemById(this.canvasItems, parentItemKey);

      if (!parentItem) {
        return;
      }

      items = parentItem.children || [];
    }


    const index = items.findIndex(item => item.key === itemId);

    if (index < 0) {
      return;
    }

    if (index > -1) {
      items.splice(index, 1);
    }

    this.setCanvasItems(this.canvasItems);

    this.setSelectedCanvasItemKey(undefined);
  }

  updateCss(css: Css) {
    const selectedFrame = this.selectedCanvasItem();

    if (!selectedFrame) {
      return;
    }

    selectedFrame.css = css;

    this.cssChangedSubject.next(undefined);

    // TODO: Handle undo/redo in a different way
    this.setCanvasItems(this.canvasItems);
  }

  moveItemChild(currentItemId: string | undefined, previousItemId: string, previousIndex: number, currentIndex: number) {
    if (currentItemId === previousItemId && currentItemId === CANVAS_WRAPPER_ID) {
      moveItemInArray(this.canvasItems, previousIndex, currentIndex);
      this.setCanvasItems(cloneDeep(this.getState().canvasItems));
      return;
    }

    const currentContainer = this.getItemById(this.canvasItems, currentItemId);
    const previousContainer = this.getItemById(this.canvasItems, previousItemId);

    if (currentItemId === previousItemId && currentContainer?.children) {
      moveItemInArray(currentContainer?.children, previousIndex, currentIndex);
    } else if(previousContainer?.children && currentContainer?.children) {
      transferArrayItem(previousContainer?.children, currentContainer?.children, previousIndex, currentIndex);
    }

    this.setCanvasItems(cloneDeep(this.getState().canvasItems));
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

  updateTextContent(key: string, content: string) {
    const frame = this.getItemById(this.canvasItems, key);

    if (frame?.itemType === CanvasItemType.TEXT) {
      frame.content = content;
    }

    this.setState({
      ...this.getState(),
      canvasItems: cloneDeep(this.getState().canvasItems),
    });

    this.undoRedoService.pushUndoStack(cloneDeep(this.getState().canvasItems));
  }

  renameItem(id: string, name: string) {
    const selectedItem = this.getItemById(this.canvasItems, id);
    if (!selectedItem) {
      return;
    }

    selectedItem.label = name;

    this.setState({
      ...this.getState(),
      canvasItems: cloneDeep(this.getState().canvasItems),
    })
  }

  pasteItem(copyItemId: string | undefined, pasteItemId: string | undefined) {
    if (!copyItemId || !pasteItemId) {
      return;
    }

    const copyItem = this.getItemById(this.canvasItems, copyItemId);

    if (!copyItem) {
      return;
    }

    const duplicatedItem = cloneDeep(copyItem);
    this.assignKeys([duplicatedItem], undefined, true);

    this.insertItem(pasteItemId, duplicatedItem);
  }

  private assignKeys(frames: CanvasItem[] | undefined, parentKey: string | undefined, overwriteExistingKeys: boolean) {
    if (!frames) {
      return [];
    }

    frames.forEach(frame => {
      if (overwriteExistingKeys || (!overwriteExistingKeys && !frame.key)) {
        frame.key = this.generateUniqueId();
      }

      if (frame.children && frame.children.length > 0) {
        this.assignKeys(frame.children, frame.key, overwriteExistingKeys);
      }
    });

    return frames;
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



  private getItemById(frames: CanvasItem[] | undefined, key: string | undefined): CanvasItem | undefined {
    if (!frames || !frames.length || key == null) {
      return undefined;
    }

    for (const frame of frames) {
      if (frame.key === key) {
        return frame;
      }

      const childFrame = this.getItemById(frame.children, key);
      if (childFrame) {
        return childFrame;
      }
    }

    return undefined;
  }

  private insertItem(insertAfterFrameId: string, newFrame: CanvasItem) {
    const parentFrameKey = this.getParentItemKey(insertAfterFrameId, this.canvasItems, CANVAS_WRAPPER_ID) || CANVAS_WRAPPER_ID;

    if (parentFrameKey === CANVAS_WRAPPER_ID) {
      const frames = this.getState().canvasItems || [];
      if (!insertAfterFrameId || insertAfterFrameId === CANVAS_WRAPPER_ID) {
        frames.push(newFrame);
      } else {
        const insertAfterFrameIndex = this.canvasItems.findIndex(frame => frame.key === insertAfterFrameId);
        frames.splice(insertAfterFrameIndex + 1, 0, newFrame);
      }
    } else {
      const parentFrame = this.getItemById(this.canvasItems, parentFrameKey);
      if (!parentFrame) {
        return;
      }

      if (!parentFrame?.children) {
        parentFrame.children = [];
      }

      parentFrame?.children?.splice(parentFrame.children.findIndex(frame => frame.key === insertAfterFrameId) + 1, 0, newFrame);
    }

    this.setState({
      ...this.getState(),
      canvasItems: cloneDeep(this.getState().canvasItems),
    })

    this.setCanvasItems(cloneDeep(this.getState().canvasItems));

    this.setSelectedCanvasItemKey(newFrame.key);
  }
}
