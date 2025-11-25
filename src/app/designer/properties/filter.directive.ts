import { Directive, Input, OnChanges, TemplateRef, ViewContainerRef, inject } from '@angular/core';
@Directive({
  selector: '[appFilter]',
})
export class FilterDirective implements OnChanges {
  private templateRef = inject<TemplateRef<any>>(TemplateRef);
  private viewContainerRef = inject(ViewContainerRef);

  @Input({required: true}) appFilter!: any;
  @Input() appFilterCssProperties: any[] = [];
  @Input() appFilterSearchText = '';
  @Input() appFilterLabel = '';

  public ngOnChanges() {
    this.viewContainerRef.clear();
    if (this.mustRender()) {
      this.viewContainerRef.createEmbeddedView(this.templateRef);
    }
  }

  private mustRender() {
    if (this.appFilterCssProperties?.length && !this.appFilterCssProperties.includes(this.appFilter)) {
      return false;
    }

    if (this.appFilterSearchText) {
      return this.appFilterLabel.toLocaleLowerCase().includes(this.appFilterSearchText.toLocaleLowerCase());
    }

    return true;
  }
}
