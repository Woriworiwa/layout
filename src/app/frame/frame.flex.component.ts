import {Component, ElementRef, Input, Renderer2, RendererStyleFlags2} from '@angular/core';
import { CommonModule } from '@angular/common';
import {FlexItemComponent} from "./frame.flex/flex-item.component";
import {FlexDirectionDirective} from "./frame.flex/directives/flex-direction.directive";
import {FlexContainerComponent} from "./frame.flex/flex-container.component";
import {FlexDirection, FlexLayoutSettings} from "../services/frame.model";

@Component({
  selector: 'app-frame-flex',
  standalone: true,
  imports: [CommonModule, FlexItemComponent, FlexContainerComponent, FlexDirectionDirective],
  template: `
    <app-flex-container [flexDirection]="settings?.flexDirection">
      <app-flex-item>
        item
      </app-flex-item>
      <app-flex-item>
        item
      </app-flex-item>
      <app-flex-item>
        item
      </app-flex-item>
    </app-flex-container>
  `,
  styles: ``
})
export class FrameFlexComponent {
  @Input() settings: FlexLayoutSettings | undefined;

  constructor(private elementRef: ElementRef,
              private renderer: Renderer2) {

  }
}
