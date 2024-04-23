import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DropdownModule} from "primeng/dropdown";
import {PropertyPanelRowComponent} from "./property-panel-row.component";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {InputNumberModule} from "primeng/inputnumber";
import {SliderModule} from "primeng/slider";
import {POSTFIX_UNIT} from "../../../models/css.model";

@Component({
  selector: 'app-property-item-slider',
  standalone: true,
  imports: [CommonModule, DropdownModule, PropertyPanelRowComponent, ReactiveFormsModule, InputNumberModule, SliderModule],
  template: `
    <app-property-panel-row [label]="label">
      <div>
        <p-inputNumber inputId="integeronly" [formControl]="control" [suffix]="suffix"></p-inputNumber>
        <p-slider [formControl]="control" [max]="max" ></p-slider>
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
  @Input() max: number = 100;
  @Input() controlValue: unknown = null;
  @Input() suffix: string | undefined = POSTFIX_UNIT;

  constructor(private cd: ChangeDetectorRef) {
  }

  ngOnChanges() {
    this.control.valueChanges.subscribe((v: any) => {
      this.control.setValue(v, {emitEvent: false});
    })
  }
}
