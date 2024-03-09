import {Component, Input} from '@angular/core';
import { CommonModule } from '@angular/common';
import {FrameSettings, FrameType} from "../services/frame.model";
import {FrameStackComponent} from "./frame.stack.component";
import {FrameGridComponent} from "./frame.grid.component";

@Component({
  selector: 'app-frame',
  standalone: true,
  imports: [CommonModule, FrameStackComponent, FrameGridComponent],
  template: `
    @switch (frameSettings?.frameType) {
      @case (FrameType.STACK) {
        <app-frame-stack></app-frame-stack>
      }
      @case (FrameType.GRID) {
        <app-frame-grid></app-frame-grid>
      }
    }
  `,
  styles: ``
})
export class FrameComponent {
  @Input() frameSettings: FrameSettings | null = null;
  protected readonly FrameType = FrameType;
}
