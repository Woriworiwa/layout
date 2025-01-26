import {
  Component,
  ElementRef,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SelectionService} from "./selection.service";

@Component({
  selector: 'app-selection-layer',
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
export class SelectionLayerComponent implements OnChanges {
  @Input()
  canvasElement: ElementRef | undefined;

  @ViewChild("overlay", {read: ViewContainerRef})
  overlay!: ViewContainerRef;

  constructor(private selectionService: SelectionService) {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['canvasElement'] && this.canvasElement) {
      this.selectionService.initialize(this.overlay, this.canvasElement!);
    }
  }
}
