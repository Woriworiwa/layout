import {Directive, Input, OnChanges, TemplateRef, ViewContainerRef} from '@angular/core';
@Directive({
  selector: '[filter]',
})
export class FilterDirective implements OnChanges {
  @Input({required: true}) filter!: any;
  @Input() filterCssProperties: any[] = [];
  @Input() filterSearchText = '';
  @Input() filterLabel = '';

  constructor(private templateRef: TemplateRef<any>,
              private viewContainerRef: ViewContainerRef) {}

  public ngOnChanges() {
    this.viewContainerRef.clear();
    if (this.mustRender()) {
      this.viewContainerRef.createEmbeddedView(this.templateRef);
    }
  }

  private mustRender() {
    if (this.filterCssProperties?.length && !this.filterCssProperties.includes(this.filter)) {
      return false;
    }

    if (!!this.filterSearchText) {
      return this.filterLabel.toLocaleLowerCase().includes(this.filterSearchText.toLocaleLowerCase());
    }

    return true;
  }
}
