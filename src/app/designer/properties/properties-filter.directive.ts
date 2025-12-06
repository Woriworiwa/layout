import { Directive, input, TemplateRef, ViewContainerRef, inject, effect } from '@angular/core';
import { PropertiesService } from './properties.service';

@Directive({
  selector: '[appPropertiesFilter]',
})
export class PropertiesFilterDirective {
  private templateRef = inject<TemplateRef<any>>(TemplateRef);
  private viewContainerRef = inject(ViewContainerRef);
  private propertiesService = inject(PropertiesService);

  appPropertiesFilter = input.required<any>();
  appPropertiesFilterLabel = input<string>('');

  constructor() {
    effect(() => {
      this.viewContainerRef.clear();

      const includesSearchText = !this.propertiesService.searchText() || this.appPropertiesFilterLabel().toLocaleLowerCase().includes(this.propertiesService.searchText().toLocaleLowerCase());

      if (includesSearchText) {
        this.viewContainerRef.createEmbeddedView(this.templateRef);
      }
    });
  }
}
