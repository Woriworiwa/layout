import {
  AfterContentInit,
  AfterViewInit,
  Component,
  ContentChild,
  effect,
  ElementRef,
  inject,
  input,
  OnDestroy,
  signal,
  viewChild,
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
import {
  FOCUSABLE_CONTROL_SELECTOR,
  PropertiesKeyboardNavigationService,
} from '../properties-keyboard-navigation.service';
import { PropertyGroupComponent } from './property-group.component';

@Component({
  selector: 'app-property-row',
  imports: [CommonModule, PropertiesFilterDirective, Checkbox, FormsModule],
  template: `
    <div
      #rowElement
      *appPropertiesFilter
      tabindex="0"
      class="label-left property-row border-b border-surface-100 dark:border-surface-700 px-4 py-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-inset"
      [class.property-disabled]="!isEnabled()"
      (keydown)="onKeydown($event)"
    >
      <div
        class="flex items-center gap-5 whitespace-nowrap font-mono text-surface-800 dark:text-surface-400"
        [class]="contentTypeClass"
      >
        <p-checkbox
          [binary]="true"
          [ngModel]="isEnabled()"
          [inputId]="label()"
          (ngModelChange)="onCheckboxChange($event)"
        />
        <label [for]="label()">{{ label() }}</label>
      </div>

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
      grid-template-columns: minmax(200px, 1fr) minmax(0, 2fr);
      gap: 1rem;
      align-items: center;
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
export class PropertyRowComponent
  implements AfterContentInit, AfterViewInit, OnDestroy
{
  label = input<string>('');
  control = input<FormControl<number | string | null>>(new FormControl(null));

  @ContentChild(NumberField) sliderComponent?: NumberField;
  @ContentChild(ButtonGroupComponent)
  buttonGroupComponent?: ButtonGroupComponent;
  @ContentChild(TextFieldComponent)
  textFieldComponent?: TextFieldComponent;
  @ContentChild(TextAreaFieldComponent)
  textAreaFieldComponent?: TextAreaFieldComponent;

  private readonly rowElement =
    viewChild<ElementRef<HTMLElement>>('rowElement');
  private readonly navService = inject(PropertiesKeyboardNavigationService, {
    optional: true,
  });
  private readonly propertyGroup = inject(PropertyGroupComponent, {
    optional: true,
    skipSelf: true,
  });

  propertiesConfig: PropertiesConfig;
  contentTypeClass = '';

  // Track visibility state for filtering
  isVisible = signal(true);

  // Track enabled state based on whether the control has a value
  isEnabled = signal(false);

  // Store the previous value when checkbox is unchecked, so we can restore it later
  private previousValue = signal<number | string | null>(null);

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

  ngAfterViewInit() {
    const element = this.rowElement()?.nativeElement;
    if (element && this.navService) {
      const group = this.propertyGroup;
      this.navService.registerRow(
        element,
        () => this.isVisible(),
        () => this.focusFirstControl(),
        group ? () => group.expand() : null,
      );
    }
  }

  ngOnDestroy() {
    if (this.valueChangesSubscription) {
      this.valueChangesSubscription.unsubscribe();
    }

    const element = this.rowElement()?.nativeElement;
    if (element && this.navService) {
      this.navService.unregisterRow(element);
    }
  }

  onKeydown(event: KeyboardEvent): void {
    if (!this.navService) return;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this.navService.focusNextRow();
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.navService.focusPreviousRow();
        break;
      case 'ArrowRight':
        event.preventDefault();
        this.navService.focusRowControl();
        break;
      case 'Escape':
        event.preventDefault();
        this.navService.clearAndFocusCanvas();
        break;
    }
  }

  focusFirstControl(): HTMLElement | null {
    const element = this.rowElement()?.nativeElement;
    if (!element) return null;

    const focusable = element.querySelector(
      FOCUSABLE_CONTROL_SELECTOR,
    ) as HTMLElement | null;

    focusable?.focus();
    return focusable;
  }

  focus(): void {
    this.rowElement()?.nativeElement?.focus();
  }

  private updateEnabledState(value: any) {
    this.isEnabled.set(value !== null && value !== undefined);
  }

  onCheckboxChange(checked: boolean) {
    const control = this.control();
    if (!control) return;

    if (!checked) {
      // When unchecked, save the current value before clearing
      const currentValue = control.value;
      if (currentValue !== null && currentValue !== undefined) {
        this.previousValue.set(currentValue);
      }
      control.setValue(null);
      control.markAsDirty();
    } else {
      // When checked, restore the previous value if one exists
      const savedValue = this.previousValue();
      if (savedValue !== null && savedValue !== undefined) {
        control.setValue(savedValue);
        control.markAsDirty();
      }
    }
  }
}
