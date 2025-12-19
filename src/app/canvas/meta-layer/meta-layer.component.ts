import {
  Component,
  ElementRef,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
  ViewContainerRef,
  inject,
} from '@angular/core';

import { MetaLayerService } from './meta-layer.service';

@Component({
  selector: 'app-meta-layer',
  imports: [],
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
export class MetaLayerComponent implements OnChanges {
  private metaLayerService = inject(MetaLayerService);

  @Input()
  canvasElement: ElementRef | undefined;

  @ViewChild('overlay', { read: ViewContainerRef })
  overlay!: ViewContainerRef;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['canvasElement'] && this.canvasElement) {
      this.metaLayerService.initialize(this.overlay, this.canvasElement!);
    }
  }
}
