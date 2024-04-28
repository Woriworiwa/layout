import {Injectable} from "@angular/core";
import {Store} from "./store";
import {CanvasItem} from "../models/canvas-item.model";
import cloneDeep from 'lodash.clonedeep';
import {distinctUntilChanged, map, Subject} from "rxjs";
import {CanvasItemType} from "../models/enums";
import {CANVAS_WRAPPER_ID} from "../models/constants";
import {moveItemInArray, transferArrayItem} from "@angular/cdk/drag-drop";
import {Css} from "../models/css.model";
import {Preset} from "../models/preset.model";
import {flexPresets, textPresets} from "../data/presets";
import {UndoRedoService} from "../services/undo-redo.service";

export class CanvasState {
  frames: CanvasItem[] = [];
  selectedFrameKey: string | undefined;
  hoverFrameKey: string | undefined;
}

@Injectable({
  providedIn: 'root'
})
export class CanvasStore extends Store<CanvasState> {
  private frameCssChangedSubject = new Subject();
  private undoStack: CanvasItem[][] = [];
  private redoStack: CanvasItem[][] = [];

  frameCssChanged$ = this.frameCssChangedSubject.asObservable();

  constructor(private undoRedoService: UndoRedoService) {
    super(new CanvasState());

    this.undoRedoService.data$.subscribe((currentState: CanvasItem[]) => {
      this.setFrames(currentState, false);
    })
  }

  get frames$() {
    return this.state.pipe(
      map(state => state.frames),
      distinctUntilChanged()
    )
  }

  get frames() {
    return this.getState().frames;
  }

  setFrames(frames: CanvasItem[], pushToUndoStack = true) {
    this.setState({
      ...this.getState(),
      frames: [...this.assignKeys(frames, undefined, false)]
    });

    if (pushToUndoStack) {
      this.undoRedoService.pushUndoStack(cloneDeep(this.getState().frames));
    }
  }

  get selectedFrame$() {
    return this.state.pipe(
      map(state => state.selectedFrameKey),
      distinctUntilChanged(),
      map(selectedFrameKey => this.getItemById(this.getState().frames, selectedFrameKey))
    );
  }

  //TODO: change to getter to match the above properties
  selectedFrame() {
    return this.getItemById(this.getState().frames, this.getState().selectedFrameKey);
  }

  setSelectedFrameKey(key: string | undefined) {
    this.setState({
      ...this.getState(),
      selectedFrameKey: key
    })
  }

  get hoverFrame$() {
    return this.state.pipe(
      map(state => state.hoverFrameKey),
      distinctUntilChanged(),
      map(hoverFrameKey => this.getItemById(this.getState().frames, hoverFrameKey))
    );
  }

  setHoverFrameKey(key: string | undefined) {
    this.setState({
      ...this.getState(),
      hoverFrameKey: key
    })
  }

  addNewPreset(presetId: string, insertAfterFrameId: string) {
    const preset = this.getPreset(presetId);

    if (!preset) {
      return;
    }

    const newFrame = cloneDeep(preset.presetDefinition);
    this.assignKeys([newFrame], undefined, false);

    this.insertItem(insertAfterFrameId, newFrame);
  }

  deleteFrame(frameId: string | undefined) {
    if (!frameId) {
      return;
    }

    const parentFrameKey = this.getParentFrameKey(frameId, this.frames, CANVAS_WRAPPER_ID);
    let frames: CanvasItem[] = []
    if (parentFrameKey === CANVAS_WRAPPER_ID) {
      frames = this.frames;
    } else {
      const parentFrame = this.getItemById(this.frames, parentFrameKey);

      if (!parentFrame) {
        return;
      }

      frames = parentFrame.children || [];
    }


    const index = frames.findIndex(frame => frame.key === frameId);

    if (index < 0) {
      return;
    }

    if (index > -1) {
      frames.splice(index, 1);
    }

    this.setFrames(this.frames);

    this.setSelectedFrameKey(undefined);
  }

  updateCss(css: Css) {
    const selectedFrame = this.selectedFrame();

    if (!selectedFrame) {
      return;
    }

    selectedFrame.css = css;

    this.frameCssChangedSubject.next(undefined);
  }

  moveFrameChild(currentFrameId: string | undefined, previousFrameId: string, previousIndex: number, currentIndex: number) {
    if (currentFrameId === previousFrameId && currentFrameId === CANVAS_WRAPPER_ID) {
      moveItemInArray(this.frames, previousIndex, currentIndex);
      return;
    }

    const currentContainer = this.getItemById(this.frames, currentFrameId);
    const previousContainer = this.getItemById(this.frames, previousFrameId);

    if (currentFrameId === previousFrameId) {
      moveItemInArray(currentContainer?.children!, previousIndex, currentIndex);
    } else {
      transferArrayItem(previousContainer?.children!, currentContainer?.children!, previousIndex, currentIndex);
    }

    this.setState({
      ...this.getState(),
      frames: cloneDeep(this.getState().frames),
    })
  }

  getParentFrameKey(childKey: string, frames: CanvasItem[], parentKey: string | undefined): string | undefined {
    for (const item of frames) {
      if (item.key === childKey) {
        return parentKey;
      }

      if (item.children) {
        for (const child of item.children) {
          if (child.key === childKey) {
            return item.key;
          } else if (child.children) {
            const parent = this.getParentFrameKey(childKey, child.children, child.key);
            if (parent) {
              return parent;
            }
          }
        }
      }
    }
    return undefined;
  }

  getPresets() {
    return [...flexPresets as Preset[], ...textPresets as Preset[]]
  }

  updateTextContent(key: string, content: string) {
    const frame = this.getItemById(this.frames, key);

    if (frame?.itemType === CanvasItemType.TEXT) {
      frame.label = content;
    }

    this.setState({
      ...this.getState(),
      frames: cloneDeep(this.getState().frames),
    })
  }

  renameItem(id: string, name: string) {
    const selectedItem = this.getItemById(this.frames, id);
    if (!selectedItem) {
      return;
    }

    selectedItem.label = name;

    this.setState({
      ...this.getState(),
      frames: cloneDeep(this.getState().frames),
    })
  }

  pasteItem(copyItemId: string | undefined, pasteItemId: string | undefined) {
    if (!copyItemId || !pasteItemId) {
      return;
    }

    const copyItem = this.getItemById(this.frames, copyItemId);

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

  private getPreset(presetId: string) {
    return this.getPresets().find(preset => preset.presetId === presetId);
  }

  private getItemById(frames: CanvasItem[] | undefined, key: string | undefined): CanvasItem | undefined {
    if (!frames || !frames.length || key == null) {
      return undefined;
    }

    for (let frame of frames) {
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
    const parentFrameKey = this.getParentFrameKey(insertAfterFrameId, this.frames, CANVAS_WRAPPER_ID);

    if (parentFrameKey === CANVAS_WRAPPER_ID) {
      const frames = this.getState().frames || [];
      frames.splice(this.frames.findIndex(frame => frame.key === insertAfterFrameId) + 1, 0, newFrame);
    } else {
      const parentFrame = this.getItemById(this.frames, parentFrameKey);
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
      frames: cloneDeep(this.getState().frames),
    })
    this.setFrames(cloneDeep(this.getState().frames));

    this.setSelectedFrameKey(newFrame.key);
  }
}
