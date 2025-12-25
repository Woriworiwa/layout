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

import { SelectionService } from './selection.service';

@Component({
  selector: 'app-selection-layer',
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
export class SelectionLayerComponent implements OnChanges {
  private selectionService = inject(SelectionService);

  @Input()
  canvasElement: ElementRef | undefined;

  @Input()
  allowAdd = true;

  @ViewChild('overlay', { read: ViewContainerRef })
  overlay!: ViewContainerRef;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['canvasElement'] && this.canvasElement) {
      this.selectionService.initialize(
        this.overlay,
        this.canvasElement,
        this.allowAdd,
      );
    }
  }
}
