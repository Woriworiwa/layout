import {
  Directive,
  input,
  TemplateRef,
  ViewContainerRef,
  inject,
  effect,
  Host,
  Optional,
  SkipSelf,
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

  // eslint-disable-next-line @angular-eslint/prefer-inject
  //constructor(@Optional() private propertyRow: PropertyRowComponent) {
  constructor() {
    effect(() => {
      this.viewContainerRef.clear();

      // Use the provided filter value, or fall back to the property row's label
      const filterText = this.propertyRow?.label();
      const includesSearchText = !this.propertiesService.searchText() || filterText?.toLocaleLowerCase().includes(this.propertiesService.searchText().toLocaleLowerCase());

      if (includesSearchText) {
        this.viewContainerRef.createEmbeddedView(this.templateRef);
      }
    });
  }
}
