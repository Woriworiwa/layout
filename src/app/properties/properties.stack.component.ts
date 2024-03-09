import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {StackLayoutDirection} from "../services/frame.model";
import {NbButtonGroupModule} from "@nebular/theme";
import {FormBuilder, ReactiveFormsModule} from "@angular/forms";
import {FrameService} from "../services/frame.service";

@Component({
  selector: 'app-properties-stack',
  standalone: true,
  imports: [CommonModule, NbButtonGroupModule, ReactiveFormsModule],
  template: `
    <div [formGroup]="frameForm">
      <nb-button-group (valueChange)="updateLayoutDirections($event)" formControlName="direction"
                       ngDefaultControl>
        <button nbButtonToggle
                [pressed]="layoutDirections.includes(StackLayoutDirection.HORIZONTAL)"
                [value]="StackLayoutDirection.HORIZONTAL">{{ StackLayoutDirection.HORIZONTAL }}
        </button>
        <button nbButtonToggle
                [pressed]="layoutDirections.includes(StackLayoutDirection.VERTICAL)"
                [value]="StackLayoutDirection.VERTICAL">{{ StackLayoutDirection.VERTICAL }}
        </button>
      </nb-button-group>
    </div>
  `,
  styles: `
  `
})
export class PropertiesStackComponent {
  layoutDirections = [StackLayoutDirection.HORIZONTAL];
  protected readonly StackLayoutDirection = StackLayoutDirection;

  frameForm = this.fb.group({
    direction: [[StackLayoutDirection.HORIZONTAL]]
  });

  constructor(public fb: FormBuilder,
              private frameService: FrameService) {
  }

  updateLayoutDirections(value: any): void {
    this.layoutDirections = value;
    this.frameService.updateStackLayoutDirection(value[0]);
  }
}
