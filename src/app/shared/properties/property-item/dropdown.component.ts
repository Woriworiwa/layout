import {Component, Input} from '@angular/core';
import { CommonModule } from '@angular/common';
import {DropdownModule} from "primeng/dropdown";
import {PropertyGroupRowComponent} from "./property-group-row.component";
import {ReactiveFormsModule} from "@angular/forms";
import {SelectButton} from "primeng/selectbutton";
import {PropertyItemComponent} from "./property-item.component";

@Component({
    selector: 'app-property-item-dropdown',
  imports: [CommonModule, DropdownModule, PropertyGroupRowComponent, ReactiveFormsModule, SelectButton],
    template: `
    <app-property-panel-row [label]="label">
      @if (selectControlsLayout === 'dropdown') {
        <p-dropdown ngDefaultControl
                  [options]="options"
                  [formControl]="control"
                  [showClear]="true"></p-dropdown>
      } @else {
        <p-selectbutton [options]="options" [formControl]="control"  />
      }
    </app-property-panel-row>
  `,
    styles: `
  :host {
    display: contents;
  }
  `
})
export class DropdownComponent extends PropertyItemComponent {
  @Input()
  options: any[] = [];

  @Input()
  selectControlsLayout: 'dropdown' | 'selectButton' = 'dropdown';
}
