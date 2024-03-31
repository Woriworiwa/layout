import {Injectable} from "@angular/core";
import {Store} from "./store";
import {Frame} from "../models/frame.model";
import cloneDeep from 'lodash.clonedeep';
import {distinctUntilChanged, map} from "rxjs";
import {FlexLayoutSettings} from "../models/flex-layout.model";

export class CanvasState {
  rootFrames: Frame[] = [];
  rootFrame: Frame | undefined;
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
      map(state => state.rootFrames),
      distinctUntilChanged()
    )
  }

  get frames() {
    return this.getState().rootFrames;
  }

  set frames(frames: Frame[]) {
    this.setState({
      ...this.getState(),
      rootFrames: frames
    })
  }

  get selectedFrame$() {
    return this.state.pipe(
      map(state => this.findFrameByKey(state.rootFrames, state.selectedFrameKey)),
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
    return this.findFrameByKey(this.getState().rootFrames, this.getState().selectedFrameKey);
  }

  updateFlexLayoutSettings(settings: FlexLayoutSettings) {
    const selectedFrame = this.getSelectedFrame();

    if (!selectedFrame) {
      return;
    }

    selectedFrame.flexLayoutSettings = settings;

    this.setState({
      ...this.getState(),
      rootFrame: cloneDeep(this.getState().rootFrame),
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
}
