import {Directive, ElementRef, Input, Renderer2} from "@angular/core";
import {FlexDirection} from "../../../services/frame.model";

@Directive({
  standalone: true,
  selector: '[app-flex-direction]'
})
export class FlexDirectionDirective {
  @Input() flexDirection: FlexDirection | undefined;

  constructor(private elementRef: ElementRef,
              private renderer: Renderer2) {
  }

  ngOnChanges() {
    this.renderer.setStyle(this.elementRef.nativeElement, 'flex-direction', this.flexDirection);
  }
}
