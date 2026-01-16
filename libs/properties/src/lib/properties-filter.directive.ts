import {
  Directive,
  TemplateRef,
  ViewContainerRef,
  inject,
  effect,
  ElementRef,
  Renderer2,
} from '@angular/core';
import { PropertiesService } from './properties.service';
import { PropertyRowComponent } from './components/property-row.component';
import {
  DEFAULT_PROPERTIES_CONFIG,
  PROPERTIES_CONFIG,
  PropertiesConfig,
} from './properties.config';

@Directive({
  selector: '[appPropertiesFilter]',
})
export class PropertiesFilterDirective {
  private templateRef = inject<TemplateRef<any>>(TemplateRef);
  private viewContainerRef = inject(ViewContainerRef);
  private propertiesService = inject(PropertiesService);
  private propertyRow = inject(PropertyRowComponent, {
    skipSelf: true,
    optional: true,
  });
  private elementRef = inject(ElementRef);
  private renderer = inject(Renderer2);
  private config: PropertiesConfig =
    inject(PROPERTIES_CONFIG, { optional: true }) ?? DEFAULT_PROPERTIES_CONFIG;

  constructor() {
    // Always render the template
    this.viewContainerRef.createEmbeddedView(this.templateRef);

    effect(() => {
      // Use the provided filter value, or fall back to the property row's label
      const filterText = this.propertyRow?.label()?.toLocaleLowerCase();
      const optionLabels = this.getOptionLabels();
      const searchText = this.propertiesService.searchText();
      const includesSearchText =
        !searchText || this.matchesAnyWord(filterText, optionLabels, searchText);

      // Update visibility state
      if (this.propertyRow) {
        this.propertyRow.isVisible.set(includesSearchText);
      }

      // Toggle the 'hidden' class on the host element
      const hostElement = this.elementRef.nativeElement.parentElement;
      if (hostElement) {
        if (includesSearchText) {
          this.renderer.removeClass(hostElement, 'hidden');
        } else {
          this.renderer.addClass(hostElement, 'hidden');
        }
      }
    });
  }

  /**
   * Gets the option labels from the button group component if present.
   * Returns an empty array if no button group or if the config disables this feature.
   */
  private getOptionLabels(): string[] {
    if (!this.config.searchIncludesOptionValues) return [];

    const buttonGroup = this.propertyRow?.buttonGroupComponent;
    if (!buttonGroup) return [];

    return buttonGroup
      .normalizedOptions()
      .map((opt) => opt.label.toLocaleLowerCase());
  }

  /**
   * Checks if filterText or any option label matches any word in the search query.
   * Words are split by whitespace, and a match occurs if any word
   * is found in the filterText or option labels.
   */
  private matchesAnyWord(
    filterText: string | undefined,
    optionLabels: string[],
    searchText: string,
  ): boolean {
    const searchWords = searchText
      .toLocaleLowerCase()
      .split(/\s+/)
      .filter((word) => word.length > 0);

    if (searchWords.length === 0) return true;

    // Check if any search word matches the filter text
    const matchesLabel =
      filterText && searchWords.some((word) => filterText.includes(word));

    // Check if any search word matches any option label
    const matchesOption = optionLabels.some((label) =>
      searchWords.some((word) => label.includes(word)),
    );

    return matchesLabel || matchesOption;
  }
}
