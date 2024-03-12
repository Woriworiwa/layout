import {Injectable} from "@angular/core";
import {Store} from "./store";
import {CanvasState} from "./canvas.state";
import {FlexLayoutSettings, Frame} from "../models/frame.model";
import cloneDeep from 'lodash.clonedeep';

@Injectable({
  providedIn: 'root'
})
export class CanvasStore extends Store<CanvasState> {
  constructor() {
    super(new CanvasState());
  }

  setRootFrame(rootFrame: Frame) {
    this.setState({
      ...this.getState(),
      rootFrame: rootFrame
    })
  }

  setSelectedFrameKey(key: string | undefined) {
    this.setState({
      ...this.getState(),
      selectedFrameKey: key
    })
  }

  getSelectedFrame() {
    return this.findFrameByKey(this.getState().rootFrame, this.getState().selectedFrameKey);
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

  findFrameByKey(frame: Frame | undefined, key: string | undefined): Frame | undefined {
    if (!frame || key == null) {
      return undefined;
    }

    if (frame.key === key) {
      return frame;
    }

    if (frame.children && Array.isArray(frame.children)) {
      for (let child of frame.children) {
        const foundNode = this.findFrameByKey(child, key);
        if (foundNode) {
          return foundNode;
        }
      }
    }

    return undefined;
  }
}
