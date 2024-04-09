import {
  ChangeDetectionStrategy,
  Component, ElementRef,
  EventEmitter, HostBinding,
  HostListener,
  Input,
  Output
} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Frame} from "../../../models/frame.model";
import {EditorContentDirective} from "../../../directives/editorcontent.directive";
import {DisplayFlexDirective} from "../../../directives/display-flex.directive";
import {TextComponent} from "../text/text.component";
import { FrameType } from '../../../models/enums';
import {CdkDrag, CdkDragDrop, CdkDropList} from "@angular/cdk/drag-drop";
import {CanvasStore} from "../../../store/canvas.store";
import {ButtonModule} from "primeng/button";
import {OverlayPanelModule} from "primeng/overlaypanel";
import {InsertComponent} from "../../insert/insert.component";
import {CanvasItemComponent} from "../canvas-item/canvas-item.component";

@Component({
  selector: 'app-frame',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, EditorContentDirective, DisplayFlexDirective, TextComponent, CdkDrag, CdkDropList, ButtonModule, OverlayPanelModule, InsertComponent],
  host: {
    '[class.selected]' : 'selectedFrameKey && selectedFrameKey === frame?.key',
    '[class.hover]': 'isMouseOver',
    '[class.hover-add-item-enabled]': 'isMouseOver && !selectedFrameKey'
  },

  templateUrl: 'frame.component.html',
  styleUrls: ['./frame.component.scss'],
})
export class FrameComponent extends CanvasItemComponent{
  protected readonly FrameType = FrameType;
  @Input() frame: Frame | undefined;
  @Input() selectedFrameKey!: string | undefined;
  @Input() dragDropDisabled = true;
  @Output() clicked = new EventEmitter<string>();
  @Output() frameContentChanged = new EventEmitter<{ key: string , content: string }>();

  @HostBinding('class.is-grabbing')
  isMouseOver = false;

  @HostListener('click', ['$event'])
  onClick($event:any) {
    $event.stopPropagation();
    this.clicked.emit(this.frame?.key);
  }

  @HostListener('mouseover', ['$event'])
  onMouseOver($event:any) {
    $event.stopPropagation();
    $event.stopImmediatePropagation();
    this.isMouseOver = true;
    console.log('mouse over' + $event.target)
  }

  @HostListener('mouseout', ['$event'])
  onMouseLeave($event: any) {
    $event.stopPropagation();
    this.isMouseOver = false;
    console.log('mouse leave' + $event.target)
  }

  constructor(private canvasStore: CanvasStore) {
    super();
  }

  onDrop(event: CdkDragDrop<string[]>) {
    // this.canvasStore.addNewPreset(event.item.data, event.container.id, event.currentIndex);
  }

  protected onChildClicked(key: string) {
    this.clicked.emit(key);
  }

  protected onChildFrameContentChanged({key, content}: {key: string, content: string}) {
    this.frameContentChanged.emit({key, content});
  }
}
