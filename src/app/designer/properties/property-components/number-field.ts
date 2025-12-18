import { Component, input, OnChanges, SimpleChanges } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { InputNumber } from 'primeng/inputnumber';
import { Select } from 'primeng/select';
import { Unit } from '../../../core/models/css-enums/unit.enum';
import { POSTFIX_UNIT } from '../../../core/constants';
import { BaseFormItemComponent } from './base-form-item.component';
import { ButtonDirective, ButtonIcon } from 'primeng/button';

@Component({
  selector: 'app-number-field',
  imports: [
    ReactiveFormsModule,
    InputNumber,
    Select,
    FormsModule,
    ButtonDirective,
    ButtonIcon,
  ],
  template: `
    <div class="flex items-center gap-2">
      <p-inputNumber
        [id]="label()"
        inputId="integeronly"
        fluid
        [showButtons]="true"
        (onClear)="onClearButtonClick()"
        [formControl]="displayControl"
      >
      </p-inputNumber>

      @if (unit(); as unitControl) {
      <p-select [options]="items" [formControl]="unitControl" />
      }

      <button
        type="button"
        pButton
        [dt]="button"
        (click)="onClearButtonClick()"
        [disabled]="control()?.value === null || control()?.value === undefined"
      >
        <i class="pi pi-times" pButtonIcon></i>
      </button>
    </div>
  `,
  styles: `
  :host {
    display: contents;

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
export class NumberField extends BaseFormItemComponent implements OnChanges {
  unit = input<FormControl | undefined>(undefined);
  max = input<number>(100);
  suffix = input<string | undefined>(POSTFIX_UNIT);
  visible = input<boolean>(true);

  items = [Unit.px, Unit.vh, Unit['%']];

  // Separate control for the input display with debounced updates
  displayControl = new FormControl<number | string | null>(null);

  constructor() {
    super();

    // Debounce input changes to the actual control (350ms after user stops typing)
    this.displayControl.valueChanges
      .pipe(debounceTime(350), distinctUntilChanged(), takeUntilDestroyed())
      .subscribe((value) => {
        if (this.control()?.value !== value) {
          this.control()?.setValue(value);
          this.control()?.markAsDirty();
        }
      });

    // Sync actual control changes to display control immediately (e.g., from slider)
    this.control()?.valueChanges.pipe(takeUntilDestroyed())
      .subscribe((value) => {
        if (this.displayControl.value !== value) {
          this.displayControl.setValue(value, { emitEvent: false });
        }
      });
  }

  ngOnChanges() {
    // Initialize display control with current value
    const value = this.control()?.value;
    if (value !== undefined) {
      this.displayControl.setValue(value, { emitEvent: false });
    }
  }

  onClearButtonClick() {
    this.control()?.setValue(null);
    this.displayControl.setValue(null);
  }

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
}
