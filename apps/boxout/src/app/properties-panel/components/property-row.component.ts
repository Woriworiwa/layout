import {
  AfterContentInit,
  Component,
  ContentChild,
  effect,
  inject,
  input,
  OnDestroy,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Checkbox } from 'primeng/checkbox';
import { FormControl, FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import {
  DEFAULT_PROPERTIES_CONFIG,
  PROPERTIES_CONFIG,
  PropertiesConfig,
} from '../properties.config';
import { NumberField } from './number-field';
import { ButtonGroupComponent } from './button-group.component';
import { TextFieldComponent } from './text-field.component';
import { TextAreaFieldComponent } from './text-area-field.component';
import { PropertiesFilterDirective } from '../properties-filter.directive';

@Component({
  selector: 'app-property-row',
  imports: [CommonModule, PropertiesFilterDirective, Checkbox, FormsModule],
  standalone: true,
  template: `
    <div
      *appPropertiesFilter
      class="property-row border-b border-surface-100 dark:border-surface-700 px-4 py-3"
      [ngClass]="{
        'label-top': propertiesConfig.labelPosition === 'top',
        'label-left': propertiesConfig.labelPosition === 'left',
        'property-disabled': !isEnabled(),
      }"
    >
      @if (propertiesConfig.labelPosition !== 'none') {
        <div
          class="flex items-center gap-5 whitespace-nowrap font-mono text-surface-800 dark:text-surface-400"
          [class]="contentTypeClass"
        >
          <p-checkbox
            [binary]="true"
            [ngModel]="isEnabled()"
            (ngModelChange)="onCheckboxChange($event)"
          />
          <span>{{ label() }}</span>
        </div>
      }
      <ng-content></ng-content>
    </div>
  `,
  styles: `
    :host {
      display: block;
    }

    :host.hidden {
      display: none;
    }

    .label-left {
      display: grid;
      grid-template-columns: minmax(0, 1fr) minmax(0, 2fr);
      gap: 1rem;
      align-items: center;
    }

    .label-top {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .property-row.property-disabled {
      opacity: 0.6;
      pointer-events: auto;
    }

    .property-row.property-disabled ::ng-deep input,
    .property-row.property-disabled ::ng-deep button:not(.p-checkbox-box),
    .property-row.property-disabled ::ng-deep .p-select,
    .property-row.property-disabled ::ng-deep textarea {
      opacity: 0.7;
    }
  `,
})
export class PropertyRowComponent implements AfterContentInit, OnDestroy {
  label = input<string>('');
  control = input<FormControl<number | string | null>>(new FormControl(null));

  @ContentChild(NumberField) sliderComponent?: NumberField;
  @ContentChild(ButtonGroupComponent)
  buttonGroupComponent?: ButtonGroupComponent;
  @ContentChild(TextFieldComponent)
  textFieldComponent?: TextFieldComponent;
  @ContentChild(TextAreaFieldComponent)
  textAreaFieldComponent?: TextAreaFieldComponent;

  propertiesConfig: PropertiesConfig;
  contentTypeClass = '';

  // Track visibility state for filtering
  isVisible = signal(true);

  // Track enabled state based on whether the control has a value
  isEnabled = signal(false);

  private valueChangesSubscription?: Subscription;

  constructor() {
    this.propertiesConfig =
      inject(PROPERTIES_CONFIG, { optional: true }) ??
      DEFAULT_PROPERTIES_CONFIG;

    // Set up effect to watch for control input changes and re-subscribe
    effect(() => {
      // Unsubscribe from previous control
      if (this.valueChangesSubscription) {
        this.valueChangesSubscription.unsubscribe();
      }

      // Read from the control input signal - this makes the effect reactive to control changes
      const control = this.control();
      if (control) {
        // Update enabled state based on current value
        this.updateEnabledState(control.value);

        // Subscribe to value changes to auto-enable when user modifies property
        this.valueChangesSubscription = control.valueChanges.subscribe(
          (value) => {
            this.updateEnabledState(value);
          },
        );
      }
    });
  }

  ngAfterContentInit() {
    if (
      this.sliderComponent ||
      this.buttonGroupComponent ||
      this.textFieldComponent ||
      this.textAreaFieldComponent
    ) {
      this.contentTypeClass = 'self-center';
    } else {
      this.contentTypeClass = 'mt-1';
    }
  }

  ngOnDestroy() {
    if (this.valueChangesSubscription) {
      this.valueChangesSubscription.unsubscribe();
    }
  }

  private updateEnabledState(value: any) {
    this.isEnabled.set(value !== null && value !== undefined);
  }

  onCheckboxChange(checked: boolean) {
    if (!checked) {
      // When unchecked, set control value to null (same as clear button)
      const control = this.control();
      if (control) {
        control.setValue(null);
        control.markAsDirty();
      }
    }
  }
}
