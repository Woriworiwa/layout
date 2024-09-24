import {Component, ElementRef, Input, OnChanges, Renderer2} from '@angular/core';
import { CommonModule } from '@angular/common';
import {CanvasBaseComponent} from "../canvas-base-component.component";
import {SelectionService} from "../../../services/selection.service";
import {DragulaService} from "ng2-dragula";
import {CanvasService} from "../../../services/canvas.service";
import {CopyPasteDirective} from "../../../directives/copy-paste.directive";

@Component({
  selector: 'app-text',
  standalone: true,
  imports: [CommonModule],
  template: `{{ item?.content }}`,
  hostDirectives: [CopyPasteDirective],
  styles: `
  :host{
    font-family:sans-serif;
    font-weight: lighter;
    display: block;
    padding: 5px;
    background-color: #ed9534;
    border-radius: 3px;
    border: 1px solid black;
    box-shadow: inset 3px 3px 7px 5px #f2ad62;
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

  constructor(private canvasService: CanvasService,
              private elementRef: ElementRef,
              private renderer: Renderer2,
              private dragulaService: DragulaService,
              private selectionService: SelectionService) {
    super(elementRef, renderer, canvasService, dragulaService, selectionService);
  }

  override ngOnChanges() {
    super.ngOnChanges();

    // if (this.item?.key === this.selectedFrameKey) {
    //   setTimeout(() => {
    //     this.selectionService.renderSelectionItem(this.item!, this.elementRef.nativeElement);
    //   }, 0);
    // }
  }
}
