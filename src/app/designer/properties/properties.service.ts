import { inject, Injectable, signal } from '@angular/core';
import { Css } from '../../core/models/css/css';
import { Unit } from '../../core/models/css/unit.enum';
import { CanvasService } from '../../canvas/canvas.service';
import { CONTAINER_PROPERTY_NAMES } from '../../core/models/css/container';

@Injectable()
export class PropertiesService {
  private canvasService = inject(CanvasService);

  searchText = signal('');

  updateCssCategory(
    currentCss: Css | undefined,
    cssPath: keyof Css,
    value: unknown
  ): void {
    this.canvasService.updateCss({
      ...currentCss,
      [cssPath]: value,
    });
  }

  extractNumericValue(postFixedValue: unknown): string {
    if (postFixedValue == null) {
      return '';
    }

    return String(postFixedValue).replace(/\D/g, '') || '';
  }

  extractUnit(postFixedValue: unknown): Unit {
    if (postFixedValue == null) {
      return Unit.px;
    }

    return (String(postFixedValue).replace(/[0-9]/g, '') as Unit) || Unit.px;
  }

  /**
   * Merges container properties with layout-specific properties for form patching.
   * Container properties (gap, justifyContent, etc.) are merged from css.container
   * Layout-specific properties are merged from the specified CSS path.
   */
  mergeContainerPropsForForm(
    css: Css | undefined,
    layoutCssPath: keyof Css,
    transformers?: Record<string, (value: unknown) => unknown>
  ): Record<string, unknown> {
    const mergedValues: Record<string, unknown> = {
      ...css?.container,
      ...css?.[layoutCssPath],
    };

    // Apply transformers if provided
    if (transformers) {
      Object.entries(transformers).forEach(([key, transformer]) => {
        if (key in mergedValues) {
          mergedValues[key] = transformer(mergedValues[key]);
        }
      });
    }

    return mergedValues;
  }

  /**
   * Updates CSS with split container and layout-specific properties.
   * This is the primary method for updating CSS from form values.
   * It automatically splits properties based on the Container interface.
   */
  updateCssWithSplit(
    currentCss: Css | undefined,
    formValue: Record<string, unknown>,
    layoutCssPath: keyof Css
  ): void {
    const { container, layoutSpecific } = this.splitContainerProps(formValue);

    this.canvasService.updateCss({
      ...currentCss,
      container,
      [layoutCssPath]: layoutSpecific,
    });
  }

  formatWithUnit(
    value: string | number | null | undefined,
    unit: string
  ): string | null | undefined {
    return value != null ? `${value}${unit}` : value;
  }

  renameSelectedItem(label: string): void {
    this.canvasService.renameItem(label);
  }

  /**
   * Splits form values into container and layout-specific properties.
   * Container properties (defined in the Container interface) are extracted into a container object.
   * Remaining properties are returned as layout-specific properties.
   */
  private splitContainerProps<T = Record<string, unknown>>(
    formValue: Record<string, unknown>
  ): { container: Record<string, unknown>; layoutSpecific: T } {
    const container: Record<string, unknown> = {};
    const layoutSpecific: Record<string, unknown> = {};

    Object.entries(formValue).forEach(([key, value]) => {
      if ((CONTAINER_PROPERTY_NAMES as readonly string[]).includes(key)) {
        container[key] = value;
      } else {
        layoutSpecific[key] = value;
      }
    });

    return { container, layoutSpecific: layoutSpecific as T };
  }
}
