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

  constructor() {
    // Always render the template
    this.viewContainerRef.createEmbeddedView(this.templateRef);

    effect(() => {
      // Use the provided filter value, or fall back to the property row's label
      const filterText = this.propertyRow?.label()?.toLocaleLowerCase();
      const searchText = this.propertiesService.searchText();
      const includesSearchText =
        !searchText || this.matchesAnyWord(filterText, searchText);

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
   * Checks if filterText matches any word in the search query.
   * Words are split by whitespace, and a match occurs if any word
   * is found in the filterText.
   */
  private matchesAnyWord(
    filterText: string | undefined,
    searchText: string,
  ): boolean {
    if (!filterText) return false;

    const searchWords = searchText
      .toLocaleLowerCase()
      .split(/\s+/)
      .filter((word) => word.length > 0);

    if (searchWords.length === 0) return true;

    return searchWords.some((word) => filterText.includes(word));
  }
}
