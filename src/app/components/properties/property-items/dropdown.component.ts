import {Component, Input} from '@angular/core';
import { CommonModule } from '@angular/common';
import {DropdownModule} from "primeng/dropdown";
import {PropertyPanelRowComponent} from "./property-panel-row.component";
import {FormControl, ReactiveFormsModule} from "@angular/forms";

@Component({
  selector: 'app-property-item-dropdown',
  standalone: true,
  imports: [CommonModule, DropdownModule, PropertyPanelRowComponent, ReactiveFormsModule],
  template: `
    <app-property-panel-row [label]="label">
      <p-dropdown ngDefaultControl
                  [options]="options"
                  [formControl]="control"
                  [showClear]="true"></p-dropdown>
    </app-property-panel-row>
  `,
  styles: `
  :host {
    display: contents;
  }
  `
})
export class DropdownComponent {
  @Input()
  options: any[] = [];

  @Input()
  control: FormControl<any> = new FormControl<any>('');

  @Input()
  label = '';
}
