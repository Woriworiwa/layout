import {
  ChangeDetectionStrategy,
  Component, ElementRef,
  EventEmitter, HostListener,
  Input,
  Output, Renderer2
} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CanvasItem, CanvasItemMouseEvent} from "../../../models/canvas-item.model";
import {EditorContentDirective} from "../../../directives/editorcontent.directive";
import {TextComponent} from "../text/text.component";
import {CanvasItemType} from '../../../models/enums';
import {CdkDrag, CdkDragDrop, CdkDropList} from "@angular/cdk/drag-drop";
import {CanvasStore} from "../../../store/canvas.store";
import {ButtonModule} from "primeng/button";
import {OverlayPanelModule} from "primeng/overlaypanel";
import {InsertComponent} from "../../insert/insert.component";
import {CssStyleSerializerPipe} from "../../../pipes/css-style-serializer.pipe";
import {CavnasBaseComponent} from "../canvas-base-component.component";
import {SelectionService} from "../../../services/selection.service";
import {PanZoomService} from "../../../services/pan-zoom.service";

@Component({
  selector: 'app-container',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, EditorContentDirective, TextComponent, CdkDrag, CdkDropList, ButtonModule, OverlayPanelModule, InsertComponent, CssStyleSerializerPipe],
  templateUrl: 'container.component.html',
  host: {
    /*without tab index, the keydown listeners will not fire because the element is not focusable. Adding tabindex makes it focusable*/
    '[attr.tabindex]': '-1',
  },
  styleUrls: ['./container.component.scss'],
})
export class ContainerComponent extends CavnasBaseComponent {
  protected readonly FrameType = CanvasItemType;
  @Output() childTextContentChanged = new EventEmitter<{ key: string, content: string }>();
  @Input() selectedFrameKey!: string | undefined;

  constructor(private canvasStore: CanvasStore,
              private elementRef: ElementRef,
              private renderer: Renderer2,
              protected panZoomService: PanZoomService,
              private selectionService: SelectionService) {
    super(elementRef, renderer, canvasStore, selectionService);
  }

  onDrop(event: CdkDragDrop<string | undefined, any>) {
    this.canvasStore.moveItemChild(event.container.data, event.previousContainer.data, event.previousIndex, event.currentIndex);
  }

  protected onChildFrameClick(event: CanvasItemMouseEvent) {
    this.clicked.emit(event);
  }

  onChildMouseOver(event: CanvasItemMouseEvent) {
    this.mouseOver.emit(event);
  }

  onChildMouseOut(event: CanvasItemMouseEvent) {
    this.mouseOut.emit(event);
  }

  onChildContextMenu(event: CanvasItemMouseEvent) {
    this.contextMenu.emit(event);
  }

  protected onChildTextContentChanged({key, content}: { key: string, content: string }) {
    this.childTextContentChanged.emit({key, content});
  }

  oncChildCopy($event: CanvasItem) {
    this.copyItem.emit($event);
  }

  onChildPaste($event: CanvasItem) {
    this.pasteItem.emit($event);
  }
}
