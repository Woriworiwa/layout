import {Injectable} from "@angular/core";
import {Store} from "./store";
import {Frame} from "../models/frame.model";
import cloneDeep from 'lodash.clonedeep';
import {distinctUntilChanged, map} from "rxjs";
import {FlexLayoutSettings} from "../models/flex-layout.model";

export class CanvasState {
  frames: Frame[] = [];
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
    )
  }

  get frames() {
    return this.getState().frames;
  }

  set frames(frames: Frame[]) {
    this.setState({
      ...this.getState(),
      frames: this.assignKeys(frames, undefined)
    });
  }

  get selectedFrame$() {
    return this.state.pipe(
      map(state => this.findFrameByKey(state.frames, state.selectedFrameKey)),
      distinctUntilChanged()
    );
  }

  setSelectedFrameKey(key: string | undefined) {
    this.setState({
      ...this.getState(),
      selectedFrameKey: key
    })
  }

  getSelectedFrame() {
    return this.findFrameByKey(this.getState().frames, this.getState().selectedFrameKey);
  }

  addFrame(frame: Frame, index: number) {
    const frames = this.getState().frames;
    frames.splice(index, 0, frame);
    this.frames = frames;
  }

  updateFlexLayoutSettings(settings: FlexLayoutSettings) {
    const selectedFrame = this.getSelectedFrame();

    if (!selectedFrame) {
      return;
    }

    selectedFrame.flexLayoutSettings = settings;

    this.setState({
      ...this.getState(),
      frames: cloneDeep(this.getState().frames),
    })
  }

  private findFrameByKey(frames: Frame[], key: string | undefined): Frame | undefined {
    if (!frames || !frames.length || key == null) {
      return undefined;
    }

    for (let frame of frames) {
      if (frame.key === key) {
        return frame;
      }

      const childFrame = this.findFrameByKey(frame.children, key);
      if (childFrame) {
        return childFrame;
      }
    }

    return undefined;
  }

  private assignKeys(frames: Frame[], parentKey: string | undefined) {
    frames.forEach(frame => {
      frame.key = this.generateUniqueId();

      if (frame.children.length > 0) {
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
