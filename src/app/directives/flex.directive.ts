import {Directive, ElementRef, Input, Renderer2} from '@angular/core';
import {FlexLayoutSettings} from "../core/frame.model";

@Directive({
  selector: '[app-flex]',
  standalone: true,
  host: {
    '[style.display]': '"flex"',
  }
})
export class FlexDirective {
  @Input() settings: FlexLayoutSettings | undefined;

  constructor(private elementRef: ElementRef,
              private renderer: Renderer2) {
  }

  ngOnChanges() {
    if (!this.settings) {
      return;
    }

    this.setProperty('flex-wrap', this.settings.flexWrap ? 'wrap' : 'nowrap');
    this.setProperty('flex-direction', this.settings.flexDirection);
    this.setProperty('flex-wrap', this.settings.flexWrap);
    this.setProperty('gap', this.settings?.gap, 'px');
  }

  private setProperty(propertyName: string, propertyValue: string | number | undefined, suffix: string = '') {
    if (propertyValue == null) {
      return;
    }

    this.renderer.setStyle(this.elementRef.nativeElement, propertyName, propertyValue + suffix);
  };
}
