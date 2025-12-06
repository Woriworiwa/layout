import {Component, Input} from '@angular/core';

import {PropertyRowComponent} from "./property-row.component";
import {ReactiveFormsModule} from "@angular/forms";
import {SelectButton} from "primeng/selectbutton";
import {Select} from "primeng/select";
import {BaseFormItemComponent} from "./base-form-item.component";

@Component({
  selector: 'app-property-item-select-button',
  imports: [ReactiveFormsModule, SelectButton, Select],
  template: `
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
export class SelectButtonComponent extends BaseFormItemComponent{
  @Input()
  options: { label: string, value: any }[] = [];

  @Input()
  showClear = true;

  select = {
    root: {
      borderColor: 'transparent',
    }
  }
}
