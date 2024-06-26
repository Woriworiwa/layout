import {Component, ElementRef, Input, Renderer2} from '@angular/core';
import { CommonModule } from '@angular/common';
import {CavnasBaseComponent} from "../canvas-base-component.component";
import {CanvasStore} from "../../../store/canvas.store";
import {SelectionService} from "../../../services/selection.service";
import {Clipboard} from '@angular/cdk/clipboard';

@Component({
  selector: 'app-text',
  standalone: true,
  imports: [CommonModule],
  template: `{{ item?.content }}`,
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
  @Input() selectedFrameKey!: string | undefined;

  constructor(private canvasStore: CanvasStore,
              private elementRef: ElementRef,
              private renderer: Renderer2,
              private selectionService: SelectionService) {
    super(elementRef, renderer, canvasStore, selectionService);
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
