import {Component, ElementRef, OnChanges, Renderer2} from '@angular/core';
import { CommonModule } from '@angular/common';
import {CanvasItemComponent} from "../canvas-item.component";
import {SelectionService} from "../../selection/selection.service";
import {CanvasService} from "../../canvas.service";
import {KeyboardCommandsDirective} from "../../keyboard-commands.directive";

@Component({
    selector: 'app-text',
    imports: [CommonModule],
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
  constructor(canvasService: CanvasService,
              private elementRef: ElementRef,
              renderer: Renderer2,
              selectionService: SelectionService) {
    super(elementRef, renderer, canvasService, selectionService);
  }

  override ngOnChanges() {
    this.elementRef.nativeElement.innerText = this.item?.content;

    super.ngOnChanges();
  }
}
