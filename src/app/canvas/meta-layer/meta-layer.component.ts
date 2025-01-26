import {Component, ElementRef, Input, SimpleChanges, ViewChild, ViewContainerRef} from '@angular/core';
import { CommonModule } from '@angular/common';
import {MetaLayerService} from "./meta-layer.service";

@Component({
  selector: 'app-meta-layer',
  imports: [CommonModule],
  template: `
    <div class="selection-overly-inner">
      <ng-template #overlay></ng-template>
    </div>
  `,
  styles: `
    :host {
      position: absolute;
      width: 100%;
      height: 100%;
      pointer-events: none;

      .selection-overly-inner {
        position: absolute;
      }
    }
  `,
})
export class MetaLayerComponent {
  @Input()
  canvasElement: ElementRef | undefined;

  @ViewChild("overlay", {read: ViewContainerRef})
  overlay!: ViewContainerRef;

  constructor(private metaLayerService: MetaLayerService) {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['canvasElement'] && this.canvasElement) {
      this.metaLayerService.initialize(this.overlay, this.canvasElement!);
    }
  }
}
