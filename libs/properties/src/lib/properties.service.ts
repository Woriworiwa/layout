import { inject, Injectable, signal } from '@angular/core';
import { Css } from '@layout/models';
import { Unit } from '@layout/models';
import { CanvasService } from '@layout/canvas';

/**
 * Represents a CSS value that has been split into its numeric value and unit.
 * Used for form controls that need separate inputs for value and unit.
 */
export interface ValueWithUnit {
  value: string | null;
  unit: Unit;
}

@Injectable()
export class PropertiesService {
  private canvasService = inject(CanvasService);

  searchText = signal('');

  updateCssCategory(
    currentCss: Css | undefined,
    cssPath: keyof Css,
    value: unknown,
  ): void {
    this.canvasService.updateCss({
      ...currentCss,
      [cssPath]: value,
    });
  }

  extractNumericValue(postFixedValue: unknown): string | null {
    if (postFixedValue == null) {
      return null;
    }

    return String(postFixedValue).replace(/\D/g, '');
  }

  extractUnit(postFixedValue: unknown): Unit {
    if (postFixedValue == null) {
      return Unit.px;
    }

    return (String(postFixedValue).replace(/[0-9]/g, '') as Unit) || Unit.px;
  }

  /**
   * Extracts both numeric value and unit from a CSS value string.
   * Use this for properties that need separate form controls for value and unit.
   *
   * @example
   * extractValueWithUnit('10px') // { value: '10', unit: 'px' }
   * extractValueWithUnit(null)   // { value: null, unit: 'px' }
   */
  extractValueWithUnit(cssValue: unknown): ValueWithUnit {
    return {
      value: this.extractNumericValue(cssValue),
      unit: this.extractUnit(cssValue),
    };
  }

  /**
   * Processes form values to format properties that have associated unit controls.
   * Properties with units should have a companion `{property}Unit` field in the form.
   *
   * @param formValue - The form values object
   * @param propsWithUnits - Array of property names that have unit controls
   * @returns Processed values with units applied and unit fields removed
   *
   * @example
   * processFormValuesWithUnits(
   *   { gap: '10', gapUnit: 'px', flexDirection: 'row' },
   *   ['gap']
   * )
   * // Returns: { gap: '10px', flexDirection: 'row' }
   */
  processFormValuesWithUnits(
    formValue: Record<string, unknown>,
    propsWithUnits: string[],
  ): Record<string, unknown> {
    const result: Record<string, unknown> = {};

    Object.entries(formValue).forEach(([key, val]) => {
      // Skip unit fields - they're handled with their parent property
      if (key.endsWith('Unit') && propsWithUnits.includes(key.slice(0, -4))) {
        return;
      }

      // Format properties that have unit controls
      if (propsWithUnits.includes(key)) {
        const unitKey = `${key}Unit`;
        const formatted = this.formatWithUnit(
          val as string | number | null | undefined,
          formValue[unitKey] as string | null | undefined,
        );
        if (formatted != null) {
          result[key] = formatted;
        }
        return;
      }

      // Pass through other non-null values
      if (val !== null) {
        result[key] = val;
      }
    });

    return result;
  }

  /**
   * Gets flexbox/grid properties for form patching.
   * All flexbox/grid properties (gap, alignment, flex, grid) are in css.flexboxGrid.
   */
  getFlexboxGridPropsForForm(
    css: Css | undefined,
    transformers?: Record<string, (value: unknown) => unknown>,
  ): Record<string, unknown> {
    const values: Record<string, unknown> = {
      ...css?.flexboxGrid,
    };

    // Apply transformers if provided
    if (transformers) {
      Object.entries(transformers).forEach(([key, transformer]) => {
        if (key in values) {
          values[key] = transformer(values[key]);
        }
      });
    }

    return values;
  }

  /**
   * Updates flexbox/grid CSS properties from form values.
   * This is the primary method for updating flexbox/grid CSS from form values.
   */
  updateFlexboxGridCss(
    currentCss: Css | undefined,
    formValue: Record<string, unknown>,
  ): void {
    this.canvasService.updateCss({
      ...currentCss,
      flexboxGrid: formValue,
    });
  }

  formatWithUnit(
    value: string | number | null | undefined,
    unit: string | null | undefined,
  ): string | null | undefined {
    return value != null ? `${value}${unit}` : value;
  }

  renameSelectedItem(label: string): void {
    this.canvasService.renameItem(label);
  }

  updateTailwindClasses(tailwindClasses: string): void {
    this.canvasService.updateTailwindClasses(tailwindClasses);
  }
}
