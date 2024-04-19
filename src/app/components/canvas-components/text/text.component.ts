import {Component, ElementRef, Renderer2} from '@angular/core';
import { CommonModule } from '@angular/common';
import {EditorContentDirective} from "../../../directives/editorcontent.directive";
import {CanvasItemComponent} from "../../canvas/canvas-item/canvas-item.component";
import {CavnasBaseComponent} from "../canvas-base-component.component";
import {Serializer} from "../../../data/serializers/serializer";
import {CssStyleSerializer} from "../../../data/serializers/css-style.serializer";
import {CanvasStore} from "../../../store/canvas.store";

@Component({
  selector: 'app-text',
  standalone: true,
  imports: [CommonModule],
  template: `<ng-content></ng-content>`,
  styles: `
  :host{
    display: block;
    flex-grow: 1;
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
