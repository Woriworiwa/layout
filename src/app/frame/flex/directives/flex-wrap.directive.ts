import {Directive, ElementRef, Input, Renderer2} from "@angular/core";

@Directive({
  standalone: true,
  selector: '[app-flex-wrap]'
})
export class FlexWrapDirective {
  @Input() flexWrap: boolean | undefined;

  constructor(private elementRef: ElementRef,
              private renderer: Renderer2) {
  }

  ngOnChanges() {
    const property = this.flexWrap ? 'wrap' : 'nowrap';
    this.renderer.setStyle(this.elementRef.nativeElement, 'flex-wrap', property);
  }
}
