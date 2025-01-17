import {Component, ElementRef, Input, OnChanges, Renderer2} from '@angular/core';
import { CommonModule } from '@angular/common';
import {CanvasBaseComponent} from "../canvas-base-component.component";
import {SelectionService} from "../../../../services/selection.service";
import {CanvasService} from "../../../../services/canvas.service";
import {CopyPasteDirective} from "../../../../directives/copy-paste.directive";

@Component({
    selector: 'app-text',
    imports: [CommonModule],
    template: `{{ item?.content }}`,
    hostDirectives: [CopyPasteDirective],
    styles: `
  :host {
    font-family: sans-serif;
    font-weight: lighter;
    display: block;
    padding: 5px;
    background: var(--yellow-50);
    border: 1px solid var(--border-primary);
    white-space: pre-wrap;

    &[contenteditable=true]:focus {
      outline: none;
      background-color: transparent;
      box-shadow: none;
      border: 1px dashed black;
    }
  }
  `
})
export class TextComponent extends CanvasBaseComponent implements OnChanges{
  @Input() selectedFrameKey!: string | undefined;

  constructor(canvasService: CanvasService,
              elementRef: ElementRef,
              renderer: Renderer2,
              selectionService: SelectionService) {
    super(elementRef, renderer, canvasService, selectionService);
  }

  override ngOnChanges() {
    super.ngOnChanges();
  }
}
