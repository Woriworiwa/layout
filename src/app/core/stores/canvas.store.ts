import {Injectable} from "@angular/core";
import {Store} from "./store";
import {CanvasState} from "./canvas.state";
import {FlexLayoutSettings, Frame} from "../frame.model";
import cloneDeep from 'lodash.clonedeep';
import {distinctUntilChanged, map} from "rxjs";
import {moveItemInArray, transferArrayItem} from "@angular/cdk/drag-drop";

@Injectable({
  providedIn: 'root'
})
export class CanvasStore extends Store<CanvasState> {
  constructor() {
    super(new CanvasState());
  }

  get rootFrame$() {
    return this.state.pipe(
      map(state => state.rootFrame),
      distinctUntilChanged()
    )
  }

  get selectedFrame$() {
    return this.state.pipe(
      map(state => this.findFrameByKey(state.rootFrame, state.selectedFrameKey)),
      distinctUntilChanged()
    );
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

  moveFrameChild(currentFrameId: string, previousFrameId: string, previousIndex: number, currentIndex: number) {
    const currentContainer = this.findFrameByKey(this.getState().rootFrame, currentFrameId);
    const previousContainer = this.findFrameByKey(this.getState().rootFrame, previousFrameId);

    if (currentFrameId === previousFrameId) {
      moveItemInArray(currentContainer?.children!, previousIndex, currentIndex);
    } else {
      transferArrayItem(previousContainer?.children!, currentContainer?.children!, previousIndex, currentIndex);
    }

    this.setState({
      ...this.getState(),
      rootFrame: cloneDeep(this.getState().rootFrame),
    })
  }

  private findFrameByKey(frame: Frame | undefined, key: string | undefined): Frame | undefined {
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
