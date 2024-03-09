import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FlexDirection} from "../services/frame.model";
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
                [pressed]="layoutDirections.includes(StackLayoutDirection.ROW)"
                [value]="StackLayoutDirection.ROW">{{ StackLayoutDirection.ROW }}
        </button>
        <button nbButtonToggle
                [pressed]="layoutDirections.includes(StackLayoutDirection.COLUMN)"
                [value]="StackLayoutDirection.COLUMN">{{ StackLayoutDirection.COLUMN }}
        </button>
      </nb-button-group>
    </div>
  `,
  styles: `
  `
})
export class PropertiesStackComponent {
  layoutDirections = [FlexDirection.ROW];
  protected readonly StackLayoutDirection = FlexDirection;

  frameForm = this.fb.group({
    direction: [[FlexDirection.ROW]]
  });

  constructor(public fb: FormBuilder,
              private frameService: FrameService) {
  }

  updateLayoutDirections(value: any): void {
    this.layoutDirections = value;
    this.frameService.updateStackLayoutDirection(value[0]);
  }
}
