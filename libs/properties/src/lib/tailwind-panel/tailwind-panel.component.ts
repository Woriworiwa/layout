import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  CodeEditorComponent,
  codemirrorsHighlighter,
  getAutocompleteTheme,
  tailwindAutocomplete,
  THEME_CONFIG,
} from '@layout/shared';
import { Css } from '@layout/models';
import {
  TailwindCssConverter,
  TailwindParseResult,
} from '@layout/serialization';
import { CanvasService } from '@layout/canvas';

/**
 * Two-way Tailwind CSS editor panel.
 *
 * This component provides bidirectional sync between CSS properties and Tailwind classes:
 * - CSS changes from the properties panel are reflected as Tailwind classes
 * - Tailwind class edits update the CSS properties
 *
 * Classes that don't map to supported CSS properties (colors, typography, responsive
 * variants, etc.) are preserved as "unsupported" classes.
 */
@Component({
  selector: 'app-tailwind-panel',
  imports: [CodeEditorComponent, FormsModule],
  templateUrl: './tailwind-panel.component.html',
  styleUrl: './tailwind-panel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TailwindPanelComponent {
  /** Current CSS from the selected canvas item */
  css = input<Css | undefined>(undefined);

  /** Current tailwindClasses from the selected canvas item (unsupported classes) */
  tailwindClasses = input<string | undefined>(undefined);

  /** Whether an item is currently selected */
  hasSelection = input<boolean>(false);

  /** Compact mode for inline use in the properties panel */
  compact = input<boolean>(false);

  private readonly converter = inject(TailwindCssConverter);
  private readonly canvasService = inject(CanvasService);
  private readonly themeConfig = inject(THEME_CONFIG, { optional: true });

  /** Track whether we're currently updating from internal changes */
  private isInternalUpdate = false;

  /** The value displayed in the editor */
  protected editorValue = signal<string>('');

  /** Parsed unsupported classes */
  protected unsupportedClasses = signal<string[]>([]);

  /** Count of synced classes (derived from CSS) */
  protected syncedClassCount = computed(() => {
    return this.converter.cssToTailwind(this.css()).length;
  });

  /** Count of unsupported classes */
  protected unsupportedClassCount = computed(() => {
    return this.unsupportedClasses().length;
  });

  /** Dark mode from theme config */
  protected isDarkMode = computed(() => this.themeConfig?.darkMode ?? false);

  /** CodeMirror extensions for Tailwind syntax highlighting and autocomplete */
  protected editorExtensions = computed(() => [
    codemirrorsHighlighter(),
    tailwindAutocomplete(),
    getAutocompleteTheme(this.isDarkMode()),
  ]);

  constructor() {
    // Update editor value when CSS or tailwindClasses inputs change
    effect(() => {
      const css = this.css();
      const extraClasses = this.tailwindClasses() || '';

      // Don't update if we're currently processing an internal change
      if (this.isInternalUpdate) {
        return;
      }

      // Convert CSS to Tailwind classes
      const derivedClasses = this.converter.cssToTailwind(css);

      // Parse extra classes to separate any that might now be synced
      const extraParsed = this.converter.tailwindToCss(extraClasses);

      // Combine: derived from CSS + truly unsupported from extra
      const allClasses = [
        ...derivedClasses,
        ...extraParsed.unsupportedClasses,
      ].filter(Boolean);

      this.editorValue.set(allClasses.join(' '));
      this.unsupportedClasses.set(extraParsed.unsupportedClasses);
    });
  }

  /**
   * Handle changes from the code editor.
   */
  protected onEditorChange(value: string): void {
    this.isInternalUpdate = true;

    try {
      // Parse the Tailwind classes
      const result: TailwindParseResult = this.converter.tailwindToCss(value);

      // Update the unsupported classes display
      this.unsupportedClasses.set(result.unsupportedClasses);

      // Update the CSS properties via canvas service
      this.updateCssFromParsedResult(result);

      // Update the tailwindClasses (unsupported ones)
      this.canvasService.updateTailwindClasses(
        result.unsupportedClasses.join(' ')
      );
    } finally {
      // Use setTimeout to ensure the flag is cleared after Angular's change detection
      setTimeout(() => {
        this.isInternalUpdate = false;
      }, 0);
    }
  }

  /**
   * Apply parsed CSS result to the canvas.
   */
  private updateCssFromParsedResult(result: TailwindParseResult): void {
    const parsedCss = result.css;

    // Only update if there are actual CSS changes
    if (Object.keys(parsedCss).length === 0) {
      // If no synced classes, clear the CSS
      this.canvasService.updateCss({});
      return;
    }

    // Merge with existing CSS structure, replacing categories that were parsed
    const currentCss = this.css() || {};
    const mergedCss: Css = { ...currentCss };

    // For each category in the parsed result, replace the entire category
    // This ensures that removed classes also remove their CSS properties
    for (const category of ['layout', 'spacing', 'sizing', 'flexboxGrid'] as const) {
      if (parsedCss[category]) {
        mergedCss[category] = parsedCss[category] as Css[typeof category];
      } else {
        // If the category wasn't in the parsed result, check if it should be cleared
        // Only clear if there were previously classes for this category
        const currentCategoryClasses = this.getCssClassesForCategory(
          currentCss,
          category
        );
        const parsedCategoryClasses = this.getCssClassesForCategory(
          parsedCss,
          category
        );

        if (currentCategoryClasses.length > 0 && parsedCategoryClasses.length === 0) {
          // The category had CSS before but no longer has any synced classes
          // Clear it by setting to empty object
          mergedCss[category] = {} as Css[typeof category];
        }
      }
    }

    this.canvasService.updateCss(mergedCss);
  }

  /**
   * Get the Tailwind classes that would be generated for a specific CSS category.
   */
  private getCssClassesForCategory(
    css: Partial<Css> | undefined,
    category: keyof Css
  ): string[] {
    if (!css || !css[category]) {
      return [];
    }

    const categoryOnlyCss: Css = {
      [category]: css[category],
    } as Css;

    return this.converter.cssToTailwind(categoryOnlyCss);
  }
}
