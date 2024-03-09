import {Component, Input} from '@angular/core';
import { CommonModule } from '@angular/common';
import {FrameSettings, FrameType} from "../services/frame.model";
import {FrameFlexComponent} from "./frame.flex.component";
import {FrameGridComponent} from "./frame.grid.component";

@Component({
  selector: 'app-frame',
  standalone: true,
  imports: [CommonModule, FrameFlexComponent, FrameGridComponent],
  template: `
    @switch (frameSettings?.frameType) {
      @case (FrameType.STACK) {
        <app-frame-flex [settings]="frameSettings?.flexLayoutSettings"></app-frame-flex>
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
