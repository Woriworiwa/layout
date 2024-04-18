import {Component, Input} from '@angular/core';
import { CommonModule } from '@angular/common';
import {DropdownModule} from "primeng/dropdown";
import {PropertyPanelRowComponent} from "./property-panel-row.component";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {InputNumberModule} from "primeng/inputnumber";
import {SliderModule} from "primeng/slider";

@Component({
  selector: 'app-property-item-slider',
  standalone: true,
  imports: [CommonModule, DropdownModule, PropertyPanelRowComponent, ReactiveFormsModule, InputNumberModule, SliderModule],
  template: `
    <app-property-panel-row [label]="label">
      <div>
        <p-inputNumber inputId="integeronly" [formControl]="control" suffix=" px"></p-inputNumber>
        <p-slider [formControl]="control"></p-slider>
      </div>
    </app-property-panel-row>
  `,
  styles: `
  :host {
    display: contents;
  }
  `
})
export class SliderComponent {
  @Input() label: string = '';
  @Input() control: FormControl<any> = new FormControl<any>('');
  @Input() options: {label: string, value: any}[] = [];
}
