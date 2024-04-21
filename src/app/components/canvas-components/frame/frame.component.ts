import {
  Component, ElementRef,
  EventEmitter,
  Input,
  Output, Renderer2
} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CanvasItemClickEvent} from "../../../models/canvas-item.model";
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
import {CavnasBaseComponent} from "../canvas-base-component.component";
import {CanvasOverlayService} from "../../../services/canvas-overlay.service";

@Component({
  selector: 'app-frame',
  standalone: true,
  imports: [CommonModule, EditorContentDirective, TextComponent, CdkDrag, CdkDropList, ButtonModule, OverlayPanelModule, InsertComponent, CanvasItemComponent, CssStyleSerializerPipe],
  templateUrl: 'frame.component.html',
  styleUrls: ['./frame.component.scss'],
})
export class FrameComponent extends CavnasBaseComponent {
  protected readonly FrameType = FrameType;
  @Output() childTextContentChanged = new EventEmitter<{ key: string , content: string }>();
  @Input() selectedFrameKey!: string | undefined;
  @Input() dragDropDisabled = false;

  constructor(private canvasStore: CanvasStore,
              private elementRef: ElementRef,
              private renderer: Renderer2,
              private canvasOverlayService: CanvasOverlayService) {
    super(elementRef, renderer);
  }

  onDrop(event: CdkDragDrop<string | undefined, any>) {
    this.canvasStore.moveFrameChild(event.container.data, event.previousContainer.data, event.previousIndex, event.currentIndex);
  }

  override ngOnChanges() {
    super.ngOnChanges();

    if (this.item?.key === this.selectedFrameKey) {
      setTimeout(() => {
        this.canvasOverlayService.renderSelectionItem(this.item!, this.elementRef.nativeElement);
      }, 0);
    }
  }

  protected onChildFrameClick(canvasItemClick: CanvasItemClickEvent) {
    this.clicked.emit(canvasItemClick);
  }

  protected onChildTextContentChanged({key, content}: {key: string, content: string}) {
    this.childTextContentChanged.emit({key, content});
  }
}
