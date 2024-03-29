import {Directive, ElementRef, Input, Renderer2} from '@angular/core';
import {FlexLayoutSettings} from "../models/flex-layout.model";

@Directive({
  selector: '[app-flex]',
  standalone: true,
  host: {
    '[style.display]': '"flex"',
  }
})
export class FlexDirective {
  @Input() model: FlexLayoutSettings | undefined;

  constructor(private elementRef: ElementRef,
              private renderer: Renderer2) {
  }

  ngOnChanges() {
    if (!this.model) {
      return;
    }

    this.setProperty('flex-wrap', this.model.flexWrap ? 'wrap' : 'nowrap');
    this.setProperty('flex-direction', this.model.flexDirection);
    this.setProperty('flex-wrap', this.model.flexWrap);
    this.setProperty('gap', this.model?.gap, 'px');
    this.setProperty('justify-content', this.model.justifyContent);
  }

  private setProperty(propertyName: string, propertyValue: string | number | undefined, suffix: string = '') {
    if (propertyValue == null) {
      return;
    }

    this.renderer.setStyle(this.elementRef.nativeElement, propertyName, propertyValue + suffix);
  };
}
