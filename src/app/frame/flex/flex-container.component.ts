import {Component, ElementRef, Input, Renderer2} from '@angular/core';
import { CommonModule } from '@angular/common';
import {FlexLayoutSettings} from "../../core/models/frame.model";
import {FlexItemComponent} from "./flex-item.component";
import {NbCardModule} from "@nebular/theme";

@Component({
  selector: 'app-flex-container',
  standalone: true,
  imports: [CommonModule, FlexItemComponent, NbCardModule],
  template: `
    <ng-content></ng-content>
  `,
  styles: `
    :host {
      display: flex;
    }
  `
})
export class FlexContainerComponent {
  @Input() settings: FlexLayoutSettings | undefined;

  constructor(private elementRef: ElementRef,
              private renderer: Renderer2) {
  }

  ngOnChanges() {
    this.setProperty('flex-direction', this.settings?.flexDirection);
    this.setProperty('flex-wrap', this.settings?.flexWrap);
    this.setProperty('gap', this.settings?.gap + 'px');
  }

  private setProperty(propertyName: string, propertyValue: string | number | undefined) {
    if (propertyValue == null) {
      return;
    }

    this.renderer.setStyle(this.elementRef.nativeElement, propertyName, propertyValue);
  };
}
