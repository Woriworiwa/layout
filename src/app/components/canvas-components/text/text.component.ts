import {Component, ElementRef, Renderer2} from '@angular/core';
import { CommonModule } from '@angular/common';
import {CavnasBaseComponent} from "../canvas-base-component.component";
import {CanvasStore} from "../../../store/canvas.store";

@Component({
  selector: 'app-text',
  standalone: true,
  imports: [CommonModule],
  template: `<ng-content></ng-content>`,
  styles: `
  :host{
    display: block;
    padding: 5px;
    background-color: #ed9534;
    border-radius: 6px;
    border: 2px solid black;
    box-shadow: inset 3px 3px 7px 5px #f2ad62;
  }
  `
})
export class TextComponent extends CavnasBaseComponent{
  constructor(private canvasStore: CanvasStore, private elementRef: ElementRef, private renderer: Renderer2) {
    super(elementRef, renderer);
  }
}
