import {
  ChangeDetectionStrategy,
  Component, ElementRef,
  EventEmitter,
  Input,
  Output, Renderer2
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
import {CanvasItemComponent} from "../../canvas/canvas-item/canvas-item.component";
import {CssStyleSerializerPipe} from "../../../pipes/css-style-serializer.pipe";
import {Serializer} from "../../../data/serializers/serializer";
import {CssStyleSerializer} from "../../../data/serializers/css-style.serializer";
import {CavnasBaseComponent} from "../canvas-base-component.component";

@Component({
  selector: 'app-frame',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, EditorContentDirective, TextComponent, CdkDrag, CdkDropList, ButtonModule, OverlayPanelModule, InsertComponent, CanvasItemComponent, CssStyleSerializerPipe],
  templateUrl: 'frame.component.html',
  styleUrls: ['./frame.component.scss'],
})
export class FrameComponent extends CavnasBaseComponent {
  protected readonly FrameType = FrameType;
  @Output() childTextContentChanged = new EventEmitter<{ key: string , content: string }>();
  @Output() clicked = new EventEmitter<string>();
  @Input() selectedFrameKey!: string | undefined;
  @Input() dragDropDisabled = true;

  constructor(private canvasStore: CanvasStore, private elementRef: ElementRef, private renderer: Renderer2) {
    super(elementRef, renderer);
  }

  onDrop(event: CdkDragDrop<string | undefined, any>) {
    this.canvasStore.moveFrameChild(event.container.data, event.previousContainer.data, event.previousIndex, event.currentIndex);
  }

  protected onClick(key: string) {
    this.clicked.emit(key);
  }

  protected onChildTextContentChanged({key, content}: {key: string, content: string}) {
    this.childTextContentChanged.emit({key, content});
  }
}
