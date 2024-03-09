import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FlexDirectionDirective} from "./directives/flex-direction.directive";

@Component({
  selector: 'app-flex-container',
  standalone: true,
  imports: [CommonModule],
  template: `<ng-content></ng-content>`,
  hostDirectives: [{
    directive: FlexDirectionDirective,
    inputs: ['flexDirection']
  }],
  styles: `
    :host {
      display: flex;
    }
  `
})
export class FlexContainerComponent {}
