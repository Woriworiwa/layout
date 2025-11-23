import {Component, Input, ViewChild} from '@angular/core';

import {PropertyGroupRowComponent} from "./property-group-row.component";
import {FormControl, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {InputNumber} from "primeng/inputnumber";
import {SliderChangeEvent, Slider} from "primeng/slider";
import {InputGroup} from "primeng/inputgroup";
import {Select} from "primeng/select";
import {Button} from "primeng/button";
import {Unit} from "../../../core/models/css/unit.enum";
import {POSTFIX_UNIT} from "../../../core/constants";
import {FormItemComponent} from "./form-item.component";

@Component({
    selector: 'app-property-item-slider',
    imports: [PropertyGroupRowComponent, ReactiveFormsModule, InputNumber, Slider, InputGroup, Select, Button, FormsModule],
    template: `
    <app-property-panel-row [label]="label">
      <div>
        <p-inputgroup>
          <p-inputNumber [id]="label" inputId="integeronly" [formControl]="control" (onKeyDown)="onKeyDown($event)"></p-inputNumber>
          @if (unit) {
            <p-select
              [options]="items"
              [formControl]="unit"/>
          }
          <button type="button" pButton icon="pi pi-times" (click)="onClearButtonClick()"
          [disabled]="control.value === null || control.value === undefined"></button>

        </p-inputgroup>
        <p-slider [formControl]="control" [max]="max" (onChange)="onSliderChange($event)"></p-slider>
      </div>
    </app-property-panel-row>
    `,
    styles: `
  :host {
    display: contents;

    //https://github.com/primefaces/primeng/issues/9949
    // temporary workaround for the issue of inputgroup and inputnumber border radius
    ::ng-deep .p-inputgroup > p-inputnumber input.p-inputnumber-input {
      border-radius: 0;
      margin: 0;
    }

    ::ng-deep .p-inputgroup p-inputnumber:last-child input.p-inputnumber-input {
      border-top-right-radius: 3px;
      border-bottom-right-radius: 3px;
    }

    ::ng-deep .p-inputgroup p-inputnumber:first-child input.p-inputnumber-input {
      border-top-left-radius: 3px;
      border-bottom-left-radius: 3px;
    }
    // end temporary workaround

    ::ng-deep .p-inputgroup {
      position: relative;
    }

    ::ng-deep .p-select-dropdown {
      display: none;
    }

    ::ng-deep p-select {
      position: absolute;
      right: 36px;
      top: 1px;
      width: 40px !important;
    }
    ::ng-deep .p-select {
      border: 0;
      tab-index: -1;
    }
  }
  `
})
export class SliderComponent extends FormItemComponent {
  @Input() unit: FormControl | undefined = undefined;
  @Input() max = 100;
  @Input() controlValue: unknown = null;
  @Input() suffix: string | undefined = POSTFIX_UNIT;
  @Input() visible = true;

  items = [ Unit.px, Unit.vh, Unit["%"]];

  @ViewChild(InputNumber) inputNumber!: InputNumber;

  onClearButtonClick() {
    this.control.setValue(null);
  }

  onSliderChange(event: SliderChangeEvent) {
    this.control.setValue(event.value);
  }

  onKeyDown($event: KeyboardEvent) {
    if ($event.key === 'Enter') {
      this.control.setValue(this.inputNumber.value);
    }
  }
}
