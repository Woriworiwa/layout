import {Directive, Input, OnChanges, TemplateRef, ViewContainerRef} from '@angular/core';
@Directive({
  selector: '[appFilter]',
})
export class FilterDirective implements OnChanges {
  @Input({required: true}) appFilter!: any;
  @Input() appFilterCssProperties: any[] = [];
  @Input() appFilterSearchText = '';
  @Input() appFilterLabel = '';

  constructor(private templateRef: TemplateRef<any>,
              private viewContainerRef: ViewContainerRef) {}

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
