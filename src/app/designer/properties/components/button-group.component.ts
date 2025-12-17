import { Component, computed, input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BaseFormItemComponent } from './base-form-item.component';

type OptionType = string | { label: string; value: any };

@Component({
  selector: 'app-button-group',
  imports: [ReactiveFormsModule],
  template: `
    <div class="flex flex-wrap gap-1" role="group">
      @for (option of normalizedOptions(); track $index) {
        <button
          type="button"
          [attr.aria-pressed]="isSelected(option.value)"
          [class]="getButtonClasses(option.value)"
          (click)="toggleSelection(option.value)"
        >
          {{ option.label }}
        </button>
      }
    </div>
  `,
  styles: `
    :host {
      display: contents;
    }
  `,
})
export class ButtonGroupComponent extends BaseFormItemComponent {
  options = input<OptionType[] | any[]>([]);

  // Normalize options to always have {label, value} format
  normalizedOptions = computed(() => {
    return this.options().map(option => {
      if (typeof option === 'string') {
        return { label: option, value: option };
      }
      return option;
    });
  });

  isSelected(value: any): boolean {
    return this.control().value === value;
  }

  toggleSelection(value: any): void {
    const currentValue = this.control().value;
    // Toggle behavior: if already selected, deselect (set to null)
    const newValue = currentValue === value ? null : value;
    this.control().setValue(newValue);
    this.control().markAsDirty();
  }

  getButtonClasses(value: any): string {
    const isSelected = this.isSelected(value);

    const baseClasses = [
      'px-2.5',
      'py-1',
      'text-xs',
      'font-mono',
      'rounded',
      'border',
      'transition-all',
      'duration-150',
      'whitespace-nowrap',
      'select-none',
      'cursor-pointer',
      'focus:outline-none',
      'focus:ring-2',
      'focus:ring-offset-1',
    ];

    const selectedClasses = isSelected
      ? [
          'border-primary-500',
          'bg-primary-500/10',
          'text-gray-900',
          'dark:text-gray-100',
          'dark:border-primary-400',
          'dark:bg-primary-400/10',
          'font-medium',
          'focus:ring-primary-500',
        ]
      : [
          'border-transparent',
          'bg-surface-200',
          'text-gray-500',
          'dark:border-gray-600',
          'dark:text-gray-500',
          'opacity-60',
          'hover:opacity-80',
          'hover:border-gray-400',
          'dark:hover:border-gray-500',
          'focus:ring-gray-400',
        ];

    return [...baseClasses, ...selectedClasses].join(' ');
  }
}
