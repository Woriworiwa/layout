import {Component, ElementRef, Input, OnChanges, Renderer2} from '@angular/core';
import { CommonModule } from '@angular/common';
import {CanvasBaseComponent} from "../canvas-base-component.component";
import {CanvasStore} from "../../../store/canvas.store";
import {SelectionService} from "../../../services/selection.service";
import {DragulaService} from "ng2-dragula";

@Component({
  selector: 'app-text',
  standalone: true,
  imports: [CommonModule],
  template: `{{ item?.content }}`,
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
  }
  `
})
export class TextComponent extends CanvasBaseComponent implements OnChanges{
  @Input() selectedFrameKey!: string | undefined;

  constructor(private canvasStore: CanvasStore,
              private elementRef: ElementRef,
              private renderer: Renderer2,
              private dragulaService: DragulaService,
              private selectionService: SelectionService) {
    super(elementRef, renderer, canvasStore, dragulaService, selectionService);
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
