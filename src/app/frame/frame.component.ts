import {Component, Input} from '@angular/core';
import { CommonModule } from '@angular/common';
import {Frame, FrameType} from "../core/models/frame.model";
import {FlexItemComponent} from "./flex/flex-item.component";
import {NbCardModule} from "@nebular/theme";
import {FlexContainerComponent} from "./flex/flex-container.component";

@Component({
  selector: 'app-frame',
  standalone: true,
  imports: [CommonModule, FlexItemComponent, NbCardModule, FlexContainerComponent],
  template: `
    @switch (frame?.frameType) {
      @case (FrameType.FLEX) {
        <app-flex-container [settings]="frame?.flexLayoutSettings">
          @for (childFrame of frame?.children; track childFrame) {
            <app-flex-item [frame]="childFrame">
              <app-frame [frame]="childFrame"></app-frame>
            </app-flex-item>
          }
        </app-flex-container>

      }
      @case (FrameType.GRID) {
      }
    }
  `,
  styles: ``
})
export class FrameComponent {
  @Input() frame: Frame | undefined;

  protected readonly FrameType = FrameType;
}
