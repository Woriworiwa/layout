import {Component, Input, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DropdownModule} from "primeng/dropdown";
import {PropertyGroupRowComponent} from "../property-groups/property-group-row.component";
import {FormControl, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {InputNumber, InputNumberModule} from "primeng/inputnumber";
import {SliderChangeEvent, SliderModule} from "primeng/slider";
import {InputGroupModule} from "primeng/inputgroup";
import {ButtonModule} from "primeng/button";
import {FloatLabelModule} from "primeng/floatlabel";
import {InputGroupAddonModule} from "primeng/inputgroupaddon";
import {InputTextModule} from "primeng/inputtext";
import {IconFieldModule} from "primeng/iconfield";
import {InputIconModule} from "primeng/inputicon";
import {SpeedDialModule} from "primeng/speeddial";
import {Unit} from "../../../core/models/css/unit.enum";
import {POSTFIX_UNIT} from "../../../core/constants";

@Component({
    selector: 'app-property-item-slider',
    imports: [CommonModule, DropdownModule, PropertyGroupRowComponent, ReactiveFormsModule, InputNumberModule, SliderModule, InputGroupModule, ButtonModule, FloatLabelModule, InputGroupAddonModule, InputTextModule, FormsModule, IconFieldModule, InputIconModule, SpeedDialModule],
    template: `
    <app-property-panel-row [label]="label">
      <div>
        <p-inputGroup>
          <p-inputNumber [id]="label" inputId="integeronly" [formControl]="control" (onKeyDown)="onKeyDown($event)"></p-inputNumber>
          <p-dropdown *ngIf="unit"
            [options]="items"
            [formControl]="unit"/>
          <button type="button" pButton icon="pi pi-times" (click)="onClearButtonClick()"
                  [disabled]="control.value === null || control.value === undefined"></button>

        </p-inputGroup>
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

    ::ng-deep .p-dropdown-trigger {
      display: none;
    }

    ::ng-deep p-dropdown {
      position: absolute;
      right: 36px;
      top: 1px;
      width: 40px !important;
    }
    ::ng-deep .p-dropdown {
      border: 0;
      tab-index: -1;
    }
  }
  `
})
export class SliderComponent {
  @Input() label = '';
  @Input() control: FormControl<any> = new FormControl<any>('');
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
