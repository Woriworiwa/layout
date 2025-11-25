import {Component, Input} from '@angular/core';

import {PropertyGroupRowComponent} from "./property-group-row.component";
import {ReactiveFormsModule} from "@angular/forms";
import {SelectButton} from "primeng/selectbutton";
import {FormItemComponent} from "./form-item.component";

@Component({
  selector: 'app-property-item-select-button',
  imports: [PropertyGroupRowComponent, ReactiveFormsModule, SelectButton],
  template: `
    <app-property-panel-row [label]="label">
      <p-selectButton [options]="options"
                      [formControl]="control"
                      optionLabel="label"
                      optionValue="value"></p-selectButton>
    </app-property-panel-row>
  `,
  styles: `
    :host {
      display: contents;
    }
  `
})
export class SelectButtonComponent extends FormItemComponent{
  @Input()
  options: { label: string, value: any }[] = [];
}
