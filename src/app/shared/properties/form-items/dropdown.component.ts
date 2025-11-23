import {Component, Input} from '@angular/core';

import {DropdownModule} from "primeng/dropdown";
import {PropertyGroupRowComponent} from "./property-group-row.component";
import {ReactiveFormsModule} from "@angular/forms";
import {SelectButton} from "primeng/selectbutton";
import {FormItemComponent} from "./form-item.component";

@Component({
  selector: 'app-property-item-dropdown',
  imports: [DropdownModule, PropertyGroupRowComponent, ReactiveFormsModule, SelectButton],
  template: `
    <app-property-panel-row [label]="label">
      @if (propertiesConfig.selectControlsLayout === 'dropdown') {
        <p-dropdown ngDefaultControl
                    [options]="options"
                    [formControl]="control"
                    [showClear]="true"></p-dropdown>
      } @else {
        <p-selectbutton [options]="options" [formControl]="control"/>
      }
    </app-property-panel-row>
  `,
  styles: `
    :host {
      display: contents;
      white-space: nowrap;
    }
  `
})
export class DropdownComponent extends FormItemComponent {
  @Input()
  options: any[] = [];
}
