import {Component, Input} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DropdownModule} from "primeng/dropdown";
import {PropertyGroupRowComponent} from "./property-group-row.component";
import {ReactiveFormsModule} from "@angular/forms";
import {SelectButtonModule} from "primeng/selectbutton";
import {PropertyItemComponent} from "./property-item.component";

@Component({
  selector: 'app-property-item-select-button',
  imports: [CommonModule, DropdownModule, PropertyGroupRowComponent, ReactiveFormsModule, SelectButtonModule],
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
export class SelectButtonComponent extends PropertyItemComponent{
  @Input()
  options: { label: string, value: any }[] = [];
}
