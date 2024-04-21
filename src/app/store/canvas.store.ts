import {Injectable} from "@angular/core";
import {Store} from "./store";
import {CanvasItem} from "../models/canvas-item.model";
import cloneDeep from 'lodash.clonedeep';
import {distinctUntilChanged, map} from "rxjs";
import {FrameType} from "../models/enums";
import {CANVAS_WRAPPER_ID} from "../models/constants";
import {moveItemInArray, transferArrayItem} from "@angular/cdk/drag-drop";
import {Css} from "../models/css.model";
import {Preset} from "../models/preset.model";
import {flexPresets, textPresets} from "../data/presets";

export class CanvasState {
  frames: CanvasItem[] = [];
  selectedFrameKey: string | undefined;
}

@Injectable({
  providedIn: 'root'
})
export class CanvasStore extends Store<CanvasState> {
  constructor() {
    super(new CanvasState());
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

  set frames(frames: CanvasItem[]) {
    this.setState({
      ...this.getState(),
      frames: [...this.assignKeys(frames, undefined)]
    });
  }

  get selectedFrame$() {
    return this.state.pipe(
      map(state => state.selectedFrameKey),
      distinctUntilChanged(),
      map(selectedFrameKey => this.getFrameByKey(this.getState().frames, selectedFrameKey))
    );
  }

  selectedFrame() {
    return this.getFrameByKey(this.getState().frames, this.getState().selectedFrameKey);
  }

  setSelectedFrameKey(key: string | undefined) {
    this.setState({
      ...this.getState(),
      selectedFrameKey: key
    })
  }

  addNewPreset(presetId: string, insertAfterFrameId: string) {
    const preset = this.getPreset(presetId);

    if (!preset) {
      return;
    }

    const newFrame = cloneDeep(preset.presetDefinition);
    newFrame.key = this.generateUniqueId();

    const parentFrameKey = this.getParentFrameKey(insertAfterFrameId, this.frames, CANVAS_WRAPPER_ID);

    if (parentFrameKey === CANVAS_WRAPPER_ID) {
      const frames = this.getState().frames || [];
      frames.splice(this.frames.findIndex(frame => frame.key === insertAfterFrameId) + 1, 0, newFrame);
    } else {
      const parentFrame = this.getFrameByKey(this.frames, parentFrameKey);
      if (!parentFrame) {
        return;
      }

      if (!parentFrame?.children) {
        parentFrame.children = [];
      }

      parentFrame?.children?.splice(parentFrame.children.findIndex(frame => frame.key === insertAfterFrameId) + 1, 0, newFrame);
    }

    this.setSelectedFrameKey(newFrame.key);
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
      const parentFrame = this.getFrameByKey(this.frames, parentFrameKey);

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

    this.frames = this.frames;

    this.setSelectedFrameKey(undefined);
  }

  updateCss(css: Css) {
    const selectedFrame = this.selectedFrame();

    if (!selectedFrame) {
      return;
    }

    selectedFrame.css = css;

    this.setState({
      ...this.getState(),
      frames: cloneDeep(this.getState().frames),
    })
  }

  moveFrameChild(currentFrameId: string | undefined, previousFrameId: string, previousIndex: number, currentIndex: number) {
    if (currentFrameId === previousFrameId && currentFrameId === CANVAS_WRAPPER_ID) {
      moveItemInArray(this.frames, previousIndex, currentIndex);
      return;
    }

    const currentContainer = this.getFrameByKey(this.frames, currentFrameId);
    const previousContainer = this.getFrameByKey(this.frames, previousFrameId);

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

  private getFrameIds(frames?: CanvasItem[]): string[] {
    if (!frames) {
      return [];
    }

    const frameIds = frames.filter(frame => frame.frameType === FrameType.FLEX).map(frame => frame.key!);

    for (let frame of frames) {
      frameIds.push(...this.getFrameIds(frame.children));
    }

    return frameIds;
  }

  private getFrameByKey(frames: CanvasItem[] | undefined, key: string | undefined): CanvasItem | undefined {
    if (!frames || !frames.length || key == null) {
      return undefined;
    }

    for (let frame of frames) {
      if (frame.key === key) {
        return frame;
      }

      const childFrame = this.getFrameByKey(frame.children, key);
      if (childFrame) {
        return childFrame;
      }
    }

    return undefined;
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

  private assignKeys(frames: CanvasItem[] | undefined, parentKey: string | undefined) {
    if (!frames) {
      return [];
    }

    frames.forEach(frame => {
      if (!frame.key) {
        frame.key = this.generateUniqueId();
      }

      if (frame.children && frame.children.length > 0) {
        this.assignKeys(frame.children, frame.key);
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

  updateTextContent(key: string, content: string) {
    const frame = this.getFrameByKey(this.frames, key);

    if (frame?.frameType === FrameType.TEXT) {
      frame.name = content;
    }

    this.setState({
      ...this.getState(),
      frames: cloneDeep(this.getState().frames),
    })
  }
}
