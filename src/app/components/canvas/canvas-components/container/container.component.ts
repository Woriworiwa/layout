import {
  ChangeDetectionStrategy,
  Component, ElementRef,
  EventEmitter,
  Input,
  Output, Renderer2
} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CanvasItemMouseEvent} from "../../../../models/canvas-item.model";
import {EditableContentDirective} from "../../../../directives/editable-content.directive";
import {TextComponent} from "../text/text.component";
import {CanvasItemType} from '../../../../models/enums';
import {ButtonModule} from "primeng/button";
import {OverlayPanelModule} from "primeng/overlaypanel";
import {InsertComponent} from "../../../insert/insert.component";
import {CssStyleSerializerPipe} from "../../../../pipes/css-style-serializer.pipe";
import {CanvasBaseComponent} from "../canvas-base-component.component";
import {SelectionService} from "../../../../services/selection.service";
import {PanZoomService} from "../../../../services/pan-zoom.service";
import {CanvasService} from "../../../../services/canvas.service";
import {SortablejsModule} from "nxt-sortablejs";
import {Options} from "sortablejs";
import {DragDropService} from "../../../../services/drag-drop.service";

@Component({
  selector: 'app-container',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, EditableContentDirective, TextComponent, ButtonModule, OverlayPanelModule, InsertComponent, CssStyleSerializerPipe, SortablejsModule],
  templateUrl: 'container.component.html',
  host: {
    /*without tab index, the keydown listeners will not fire because the element is not focusable. Adding tabindex makes it focusable*/
    '[attr.tabindex]': '-1',
  },
  styleUrls: ['./container.component.scss'],
})
export class ContainerComponent extends CanvasBaseComponent {
  protected readonly FrameType = CanvasItemType;
  @Output() childTextContentChanged = new EventEmitter<{ key: string, content: string }>();
  @Input() selectedFrameKey!: string | undefined;

  dragOptions: Options;

  constructor(protected canvasService: CanvasService,
              private elementRef: ElementRef,
              private renderer: Renderer2,
              protected panZoomService: PanZoomService,
              private dragDropService: DragDropService,
              private selectionService: SelectionService) {
    super(elementRef, renderer, canvasService, selectionService);
    this.dragOptions = this.dragDropService.createGroup({group: 'child', ghostClass: 'drag-background-lvl-1'});
  }

  protected onChildFrameClick(event: CanvasItemMouseEvent) {
    this.dragOptions = {};
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
}
