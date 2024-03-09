import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FrameService} from "../services/frame.service";
import {NbButtonGroupModule, NbCardModule} from "@nebular/theme";
import {FormBuilder, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {FrameSettings, FrameType, FlexDirection} from "../services/frame.model";
import {FrameGridComponent} from "../frame/frame.grid.component";
import {FrameFlexComponent} from "../frame/frame.flex.component";
import {PropertiesStackComponent} from "./properties.stack.component";

@Component({
  selector: 'app-properties',
  standalone: true,
  imports: [CommonModule, NbButtonGroupModule, ReactiveFormsModule, FrameGridComponent, FrameFlexComponent, PropertiesStackComponent, NbCardModule],
  template: `
    <nb-card>
      <nb-card-header>Layout</nb-card-header>
      <nb-card-body>
        <nb-button-group (valueChange)="updateFrameType($event)">
          <button nbButtonToggle
                  [pressed]="frameTypes.includes(FrameType.GRID)"
                  [value]="FrameType.GRID">{{ FrameType.GRID }}
          </button>
          <button nbButtonToggle
                  [pressed]="frameTypes.includes(FrameType.STACK)"
                  [value]="FrameType.STACK">{{ FrameType.STACK }}
          </button>
        </nb-button-group>

        @switch ((frameService.frameSettings$|async)?.frameType) {
          @case (FrameType.STACK) {
            <app-properties-stack></app-properties-stack>
          }
          @case (FrameType.GRID) {

          }
        }
      </nb-card-body>
    </nb-card>
  `,
  styles: `
    nb-card-body {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }
  `
})
export class PropertiesComponent {
  frameTypes: [FrameType] = [FrameType.STACK];

  constructor(public fb: FormBuilder,
              protected frameService: FrameService) {
  }

  updateFrameType(value: any): void {
    this.frameService.updateFrameType(value[0]);
  }

  protected readonly FrameType = FrameType;
}
