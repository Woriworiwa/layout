import {Component, Input} from '@angular/core';

import {Select} from "primeng/select";
import {PropertyRowComponent} from "./property-row.component";
import {ReactiveFormsModule} from "@angular/forms";
import {SelectButton} from "primeng/selectbutton";
import {BaseFormItemComponent} from "./base-form-item.component";

@Component({
  selector: 'app-property-item-dropdown',
  imports: [Select, PropertyRowComponent, ReactiveFormsModule, SelectButton],
  template: `
      @if (propertiesConfig.selectControlsLayout === 'dropdown') {
        <p-select ngDefaultControl
                  [dt]="select"
                    [options]="options"
                    [formControl]="control"
                    [showClear]="true"></p-select>
      } @else {
        <p-selectbutton [options]="options" [formControl]="control"/>
      }
  `,
  styles: `
    :host {
      display: contents;
      white-space: nowrap;
    }

    :host ::ng-deep .p-selectbutton {
      flex-wrap: wrap !important;
      gap: 4px !important;
      --p-togglebutton-content-padding: 0.25rem;
    }



  `
})
export class DropdownComponent extends BaseFormItemComponent {
  @Input()
  options: any[] = [];

  select = {
    root: {
      borderColor: 'transparent',
    }
  }
}
