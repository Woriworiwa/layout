import {Component, QueryList, ViewChild, ViewChildren} from '@angular/core';
import { CommonModule } from '@angular/common';
import {FrameComponent} from "./frame/frame.component";
import {CanvasStore} from "../core/stores/canvas.store";
import {Frame} from "../core/frame.model";
import {CdkDrag, CdkDragDrop, CdkDropList, CdkDropListGroup} from "@angular/cdk/drag-drop";
import {FlexDirection} from "../core/enums";
import {DragDropService} from "../core/drag-drop.service";

@Component({
  selector: 'app-canvas',
  standalone: true,
  imports: [CommonModule, FrameComponent, CdkDropList, CdkDropListGroup],
  template: `
    <app-frame [id]="rootFrame?.key!"
               [frame]="rootFrame"
               [selectedFrameKey]="selectedFrameKey"
               (clicked)="onFrameClicked($event)"
               (frameContentChanged)="onContentChanged($event)"
    (onDrop)="onDrop($event)"></app-frame>
  `,
  styles: `
  :host{
    display: block;
    height: 100%;
    background-color: white;

    > app-frame {
      height: 100%;
      background: white;
    }
  }
  `
})
export class CanvasComponent {
  rootFrame: Frame | undefined;
  selectedFrameKey: string | undefined;

  constructor(protected canvasStore: CanvasStore, public dragDropService: DragDropService) {
    this.canvasStore.rootFrame$.subscribe(rootFrame => this.rootFrame = rootFrame);
    this.canvasStore.selectedFrame$.subscribe(selectedFrame => this.selectedFrameKey = selectedFrame?.key);
  }

  @ViewChildren(CdkDropList) dropLists?: QueryList<CdkDropList>;
  @ViewChild(CdkDropList) dropList?: CdkDropList;

  onFrameClicked(key: string) {
    this.canvasStore.setSelectedFrameKey(key);
  }

  onContentChanged(content: {key: string, content: string}) {
    console.log(content);
  }

  getDropListConnectedTo() {
    return ['canvas','canvas-0', 'canvas-1'];
  }

  ngAfterViewInit(): void {
    console.log('after view init' + this.rootFrame?.key);
    if (this.dropList) {
      this.dragDropService.register(this.dropList);
    }
  }

  onDrop(event: CdkDragDrop<any, any>) {

    debugger;
    this.canvasStore.moveFrameChild(event.container.id, event.previousContainer.id, event.previousIndex, event.currentIndex);
  }

  allowDropPredicate = (drag: CdkDrag, drop: CdkDropList) => {
    return this.isDropAllowed(drag, drop);
  };

  isDropAllowed(drag: CdkDrag, drop: CdkDropList) {
    if (this.dragDropService.currentHoverDropListId == null) {
      return true;
    }

    return drop.id === this.dragDropService.currentHoverDropListId;
  }

  protected readonly FlexDirection = FlexDirection;
}
