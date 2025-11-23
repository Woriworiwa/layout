import { Component, ElementRef, OnChanges, Renderer2, inject } from '@angular/core';

import {CanvasItemComponent} from "../canvas-item.component";
import {SelectionService} from "../../selection/selection.service";
import {CanvasService} from "../../canvas.service";
import {KeyboardCommandsDirective} from "../../keyboard-commands.directive";

@Component({
    selector: 'app-text',
    imports: [],
    template: ``,
    hostDirectives: [KeyboardCommandsDirective],
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
export class TextComponent extends CanvasItemComponent implements OnChanges{
  private elementRef: ElementRef;

  constructor() {
    const canvasService = inject(CanvasService);
    const elementRef = inject(ElementRef);
    const renderer = inject(Renderer2);
    const selectionService = inject(SelectionService);

    super(elementRef, renderer, canvasService, selectionService);
  
    this.elementRef = elementRef;
  }

  override ngOnChanges() {
    this.elementRef.nativeElement.innerText = this.item?.content;

    super.ngOnChanges();
  }
}
