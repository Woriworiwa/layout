import {Injectable} from "@angular/core";
import {Store} from "./store";
import {Frame} from "../models/frame.model";
import cloneDeep from 'lodash.clonedeep';
import {distinctUntilChanged, map} from "rxjs";
import {FlexLayoutSettings} from "../models/flex-layout.model";
import {FrameType} from "../models/enums";
import {CANVAS_WRAPPER_ID} from "../models/constants";
import {DataService} from "../services/data.service";

export class CanvasState {
  frames: Frame[] = [];
  selectedFrameKey: string | undefined;
}

@Injectable({
  providedIn: 'root'
})
export class CanvasStore extends Store<CanvasState> {
  constructor(private dataService: DataService) {
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

  set frames(frames: Frame[]) {
    this.setState({
      ...this.getState(),
      frames: [...this.assignKeys(frames, undefined)]
    });
  }

  get selectedFrame$() {
    return this.state.pipe(
      map(state => state.selectedFrameKey),
      map(selectedFrameKey => this.getFrameByKey(this.getState().frames, selectedFrameKey)),
      distinctUntilChanged()
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

  get frameIds$() {
    return this.frames$.pipe(
      map(frames => this.getFrameIds(frames)),
    )
  }

  addNewPreset(presetId: string, insertAfterFrameId: string) {
    const preset = this.dataService.getPreset(presetId);

    if (!preset) {
      return;
    }

    const newFrame = cloneDeep(preset.presetDefinition);
    newFrame.key = this.generateUniqueId();

    const parentFrameKey = this.getParentFrameKey(insertAfterFrameId, this.frames, CANVAS_WRAPPER_ID);

    if (parentFrameKey === CANVAS_WRAPPER_ID) {
      const frames = this.getState().frames || [];
      frames.splice(this.frames.findIndex(frame => frame.key === insertAfterFrameId) + 1, 0, newFrame);
      this.frames = frames;
    } else {
      const parentFrame = this.getFrameByKey(this.frames, parentFrameKey);
      if (!parentFrame) {
        return;
      }

      if (!parentFrame?.children) {
        parentFrame.children = [];
      }

      parentFrame?.children?.splice(parentFrame.children.findIndex(frame => frame.key === insertAfterFrameId) + 1, 0, newFrame);
      this.frames = this.frames;
    }

    this.setSelectedFrameKey(newFrame.key);
  }

  updateFlexLayoutSettings(settings: FlexLayoutSettings) {
    const selectedFrame = this.selectedFrame();

    if (!selectedFrame) {
      return;
    }

    selectedFrame.flexLayoutSettings = settings;

    this.setState({
      ...this.getState(),
      frames: cloneDeep(this.getState().frames),
    })
  }

  private getFrameIds(frames?: Frame[]): string[] {
    if (!frames) {
      return [];
    }

    const frameIds = frames.filter(frame => frame.frameType === FrameType.FLEX).map(frame => frame.key!);

    for (let frame of frames) {
      frameIds.push(...this.getFrameIds(frame.children));
    }

    return frameIds;
  }

  private getFrameByKey(frames: Frame[] | undefined, key: string | undefined): Frame | undefined {
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

  getParentFrameKey(childKey: string, frames: Frame[], parentKey: string | undefined): string | undefined {
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

  private assignKeys(frames: Frame[] | undefined, parentKey: string | undefined) {
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
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let uniqueId = '';

    for (let i = 0; i < 8; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      uniqueId += characters.charAt(randomIndex);
    }

    return uniqueId;
  }
}
