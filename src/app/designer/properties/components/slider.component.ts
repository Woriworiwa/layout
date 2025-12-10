import { Component, input, ViewChild } from '@angular/core';

import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputNumber } from 'primeng/inputnumber';
import { SliderChangeEvent, Slider } from 'primeng/slider';
import { InputGroup } from 'primeng/inputgroup';
import { Select } from 'primeng/select';
import { ButtonDirective, ButtonIcon } from 'primeng/button';
import { Unit } from '../../../core/models/css/unit.enum';
import { POSTFIX_UNIT } from '../../../core/constants';
import { BaseFormItemComponent } from './base-form-item.component';

@Component({
  selector: 'app-property-item-slider',
  imports: [
    ReactiveFormsModule,
    InputNumber,
    Slider,
    InputGroup,
    Select,
    FormsModule,
    ButtonDirective,
    ButtonIcon,
  ],
  template: `
    <div>
      <p-inputgroup [dt]="inputGroup">
        <p-inputNumber
          [id]="label()"
          inputId="integeronly"
          [formControl]="control()"
          (onKeyDown)="onKeyDown($event)"
        ></p-inputNumber>
        @if (unit(); as unitControl) {
        <p-select [options]="items" [formControl]="unitControl" />
        }
        <button
          type="button"
          pButton
          [dt]="button"
          (click)="onClearButtonClick()"
          [disabled]="control().value === null || control().value === undefined"
        >
          <i class="pi pi-times" pButtonIcon></i>
        </button>
      </p-inputgroup>
      <p-slider
        [formControl]="control()"
        [max]="max()"
        (onChange)="onSliderChange($event)"
        [dt]="slider"
      ></p-slider>
    </div>
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

    //::ng-deep p-select {
    //  position: absolute;
    //  right: 36px;
    //  top: 1px;
    //  width: 40px !important;
    //}

    ::ng-deep .p-select-label {
      padding: 0;
    }
    ::ng-deep .p-select {
      border: 0;
      tab-index: -1;
    }
  }
  `,
})
export class SliderComponent extends BaseFormItemComponent {
  unit = input<FormControl | undefined>(undefined);
  max = input<number>(100);
  controlValue = input<unknown>(null);
  suffix = input<string | undefined>(POSTFIX_UNIT);
  visible = input<boolean>(true);

  items = [Unit.px, Unit.vh, Unit['%']];

  @ViewChild(InputNumber) inputNumber!: InputNumber;

  onClearButtonClick() {
    this.control().setValue(null);
  }

  onSliderChange(event: SliderChangeEvent) {
    this.control().setValue(event.value);
  }

  onKeyDown($event: KeyboardEvent) {
    if ($event.key === 'Enter') {
      this.control().setValue(this.inputNumber.value);
    }
  }

  inputGroup = {
    addon: {
      borderRadius: '0',
    },
  };

  button = {
    root: {
      paddingX: '0',
      paddingY: '0',
    },
    primary: {
      background: '{form.field.background}',
      borderColor: 'transparent',
      hoverBackground: 'transparent',
      hoverColor: '{form.field.hoverColor}',
      hoverBorderColor: 'transparent',
    },
    light: {
      primary: {
        color: '{surface.400}',
        hoverBackground: 'transparent',
      },
    },
    dark: {
      primary: {
        color: '{surface.400}',
        hoverBackground: 'transparent',
      },
    },
  };

  slider = {
    handle: {
      content: {
        background: '{surface.400}',
      }
    },
  };
}
