import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CanvasItem} from "../../../models/canvas-item.model";
import {EditorContentDirective} from "../../../directives/editorcontent.directive";
import {TextComponent} from "../text/text.component";
import { FrameType } from '../../../models/enums';
import {CdkDrag, CdkDragDrop, CdkDropList} from "@angular/cdk/drag-drop";
import {CanvasStore} from "../../../store/canvas.store";
import {ButtonModule} from "primeng/button";
import {OverlayPanelModule} from "primeng/overlaypanel";
import {InsertComponent} from "../../insert/insert.component";
import {CanvasItemComponent} from "../canvas-item/canvas-item.component";
import {CssPipe} from "../../../pipes/css.pipe";

@Component({
  selector: 'app-frame',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, EditorContentDirective, TextComponent, CdkDrag, CdkDropList, ButtonModule, OverlayPanelModule, InsertComponent, CanvasItemComponent, CssPipe],
  templateUrl: 'frame.component.html',
  styleUrls: ['./frame.component.scss'],
})
export class FrameComponent{
  protected readonly FrameType = FrameType;
  @Output() frameContentChanged = new EventEmitter<{ key: string , content: string }>();
  @Input() item: CanvasItem | undefined;
  @Output() clicked = new EventEmitter<string>();
  @Input() selectedFrameKey!: string | undefined;
  @Input() dragDropDisabled = true;

  constructor(private canvasStore: CanvasStore) {

  }

  onDrop(event: CdkDragDrop<string | undefined, any>) {
    this.canvasStore.moveFrameChild(event.container.data, event.previousContainer.data, event.previousIndex, event.currentIndex);
  }

  protected onClick(key: string) {
    this.clicked.emit(key);
  }

  protected onChildFrameContentChanged({key, content}: {key: string, content: string}) {
    this.frameContentChanged.emit({key, content});
  }
}
