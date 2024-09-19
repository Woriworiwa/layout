import {
  ChangeDetectionStrategy,
  Component, ElementRef,
  EventEmitter,
  Input,
  Output, Renderer2
} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CanvasItemMouseEvent} from "../../../models/canvas-item.model";
import {EditableContentDirective} from "../../../directives/editable-content.directive";
import {TextComponent} from "../text/text.component";
import {CanvasItemType} from '../../../models/enums';
import {CanvasStore} from "../../../store/canvas.store";
import {ButtonModule} from "primeng/button";
import {OverlayPanelModule} from "primeng/overlaypanel";
import {InsertComponent} from "../../insert/insert.component";
import {CssStyleSerializerPipe} from "../../../pipes/css-style-serializer.pipe";
import {CanvasBaseComponent} from "../canvas-base-component.component";
import {SelectionService} from "../../../services/selection.service";
import {PanZoomService} from "../../../services/pan-zoom.service";
import {DragulaModule, DragulaService} from "ng2-dragula";

@Component({
  selector: 'app-container',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, EditableContentDirective, TextComponent, ButtonModule, OverlayPanelModule, InsertComponent, CssStyleSerializerPipe, DragulaModule],
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

  constructor(protected canvasStore: CanvasStore,
              private elementRef: ElementRef,
              private renderer: Renderer2,
              protected panZoomService: PanZoomService,
              private dragulaService: DragulaService,
              private selectionService: SelectionService) {
    super(elementRef, renderer, canvasStore, dragulaService, selectionService);
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
}
