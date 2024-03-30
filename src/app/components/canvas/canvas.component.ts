import {Component} from '@angular/core';
import { CommonModule } from '@angular/common';
import {FrameComponent} from "../element-components/frame/frame.component";
import {CanvasStore} from "../../store/canvas.store";
import {Frame} from "../../models/frame.model";

@Component({
  selector: 'app-canvas',
  standalone: true,
  imports: [CommonModule, FrameComponent],
  template: `
    <app-frame [frame]="rootFrame"
               [selectedFrameKey]="selectedFrameKey"
               (clicked)="onFrameClicked($event)"
               (frameContentChanged)="onContentChanged($event)"></app-frame>
  `,
  styles: `
  :host{
    /*display: block;*/
    /*height: 100%;*/
    /*width: fit-content;*/
    /*background-color: white;*/

    > app-frame {
      height: 100%;
      background: #eeeeee;
    }
  }
  `
})
export class CanvasComponent {
  rootFrame: Frame | undefined;
  selectedFrameKey: string | undefined;

  constructor(protected canvasStore: CanvasStore) {
    this.canvasStore.rootFrame$.subscribe(rootFrame => this.rootFrame = rootFrame);
    this.canvasStore.selectedFrame$.subscribe(selectedFrame => this.selectedFrameKey = selectedFrame?.key);
  }

  onFrameClicked(key: string) {
    this.canvasStore.setSelectedFrameKey(key);
  }

  onContentChanged(content: {key: string, content: string}) {
    console.log(content);
  }
}
