import {Component} from '@angular/core';
import { CommonModule } from '@angular/common';
import {FrameComponent} from "../frame/frame.component";
import {CanvasStore} from "../core/stores/canvas.store";
import {Frame} from "../core/models/frame.model";
import {distinctUntilChanged, map} from "rxjs";

@Component({
  selector: 'app-canvas',
  standalone: true,
  imports: [CommonModule, FrameComponent],
  template: `
    <app-frame [frame]="rootFrame"></app-frame>
  `,
  styles: ``
})
export class CanvasComponent {
  rootFrame: Frame | undefined;

  constructor(protected canvasStore: CanvasStore) {
    this.canvasStore.state
      .pipe(
        map(state => state.rootFrame),
        distinctUntilChanged()
      )
      .subscribe(rootFrame => this.rootFrame = rootFrame);
  }
}
