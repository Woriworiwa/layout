import {Component, Input} from '@angular/core';

import {PropertyGroupRowComponent} from "./property-group-row.component";
import {ReactiveFormsModule} from "@angular/forms";
import {SelectButton} from "primeng/selectbutton";
import {Select} from "primeng/select";
import {FormItemComponent} from "./form-item.component";

@Component({
  selector: 'app-property-item-select-button',
  imports: [PropertyGroupRowComponent, ReactiveFormsModule, SelectButton, Select],
  template: `
    <app-property-panel-row [label]="label">
      @if (propertiesConfig.selectControlsLayout === 'dropdown') {
        <p-select ngDefaultControl
                  [dt]="select"
                  [options]="options"
                  [formControl]="control"
                  [showClear]="showClear"></p-select>
      } @else {
        <p-selectButton [options]="options"
                        [formControl]="control"
                        fluid
                        optionLabel="label"
                        optionValue="value"></p-selectButton>
      }
    </app-property-panel-row>
  `,
  styles: `
    :host {
      display: contents;
    }

    :host ::ng-deep .p-selectbutton {
      flex-wrap: wrap !important;
      gap: 4px !important;
    }
  `
})
export class SelectButtonComponent extends FormItemComponent{
  @Input()
  options: { label: string, value: any }[] = [];

  @Input()
  showClear: boolean = true;

  select = {
    root: {
      borderColor: 'transparent',
    }
  }
}
