import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, inject } from '@angular/core';
import {CommonModule} from '@angular/common';
import {EditableContentDirective} from "../text/editable-content.directive";
import {TextComponent} from "../text/text.component";
import {CanvasItemType} from '../../../core/enums';
import {CanvasItemComponent} from "../canvas-item.component";
import {PanZoomService} from "../../pan-zoom/pan-zoom.service";
import {CanvasService} from "../../canvas.service";
import {SortablejsModule} from "nxt-sortablejs";
import {Options} from "sortablejs";
import {DragDropService} from "../../drag-drop/drag-drop.service";
import {CanvasItemMouseEvent} from "../canvas-item-mouse-event";
import {AssetDropDirective} from "../../drag-drop/asset-drop.directive";

@Component({
    selector: 'app-container',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CommonModule, EditableContentDirective, TextComponent, SortablejsModule],
    templateUrl: 'container.component.html',
    hostDirectives: [
      {
        directive: AssetDropDirective,
        inputs: ['appAssetDrop']
      }
    ],
    host: {
        /*without tab index, the keydown listeners will not fire because the element is not focusable. Adding tabindex makes it focusable*/
        '[attr.tabindex]': '-1',
    },
    styleUrls: ['./container.component.scss']
})
export class ContainerComponent extends CanvasItemComponent {
  protected canvasService = inject(CanvasService);
  protected panZoomService = inject(PanZoomService);
  private dragDropService = inject(DragDropService);

  protected readonly FrameType = CanvasItemType;
  @Output() childTextContentChanged = new EventEmitter<{ key: string, content: string }>();
  @Input() selectedFrameKey!: string | undefined;

  dragOptions: Options;

  constructor() {
    super();

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
