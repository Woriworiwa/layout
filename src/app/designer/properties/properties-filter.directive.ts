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
  selector: '[appPropertiesFilter]'
})
export class PropertiesFilterDirective {
  private templateRef = inject<TemplateRef<any>>(TemplateRef);
  private viewContainerRef = inject(ViewContainerRef);
  private propertiesService = inject(PropertiesService);
  private propertyRow = inject(PropertyRowComponent, { skipSelf: true, optional: true });
  private elementRef = inject(ElementRef);
  private renderer = inject(Renderer2);

  constructor() {
    // Always render the template
    this.viewContainerRef.createEmbeddedView(this.templateRef);

    effect(() => {
      // Use the provided filter value, or fall back to the property row's label
      const filterText = this.propertyRow?.label();
      const searchText = this.propertiesService.searchText();
      const includesSearchText = !searchText ||
        (filterText?.toLocaleLowerCase().includes(searchText.toLocaleLowerCase()) ?? false);

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
}
