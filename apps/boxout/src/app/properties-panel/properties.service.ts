import { inject, Injectable, signal } from '@angular/core';
import { Css } from '@layout/models';
import { Unit } from '@layout/models';
import { CanvasService } from '@layout/canvas';

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
   * Gets container properties for form patching.
   * All container properties (gap, alignment, flex, grid) are in css.container.
   */
  getContainerPropsForForm(
    css: Css | undefined,
    transformers?: Record<string, (value: unknown) => unknown>,
  ): Record<string, unknown> {
    const values: Record<string, unknown> = {
      ...css?.container,
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
   * Updates container CSS properties from form values.
   * This is the primary method for updating container CSS from form values.
   */
  updateContainerCss(
    currentCss: Css | undefined,
    formValue: Record<string, unknown>,
  ): void {
    this.canvasService.updateCss({
      ...currentCss,
      container: formValue,
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
