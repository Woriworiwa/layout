import {
  ChangeDetectionStrategy,
  Component, ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output, ViewChild
} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Frame} from "../../core/frame.model";
import {NbCardModule} from "@nebular/theme";
import {EditorContentDirective} from "../../directives/editorcontent.directive";
import {FlexDirective} from "../../directives/flex.directive";
import {TextComponent} from "../text.component";
import {FlexDirection, FrameType} from '../../core/enums';
import {
  CdkDrag,
  CdkDragDrop,
  CdkDragMove, CdkDragPlaceholder, CdkDragRelease,
  CdkDropList,
  CdkDropListGroup,
  moveItemInArray
} from "@angular/cdk/drag-drop";
import {CanvasStore} from "../../core/stores/canvas.store";
import {DragDropService} from "../../core/drag-drop.service";

@Component({
  selector: 'app-frame',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, NbCardModule, EditorContentDirective, FlexDirective, TextComponent, CdkDrag, CdkDropList, CdkDropListGroup, CdkDragPlaceholder],
  host: {
    '[class.selected]' : 'selectedFrameKey === frame?.key'
  },

  templateUrl: 'frame.component.html',
  styleUrls: ['./frame.component.scss'],
})
export class FrameComponent {
  protected readonly FrameType = FrameType;
  @Input() frame: Frame | undefined;
  @Input() selectedFrameKey!: string | undefined;
  @Output() clicked = new EventEmitter<string>();
  @Output() frameContentChanged = new EventEmitter<{ key: string , content: string }>();
  @Output() onDrop = new EventEmitter<CdkDragDrop<undefined, undefined>>();

  @HostListener('click', ['$event'])
  onClick($event:any) {
    $event.stopPropagation();
    this.clicked.emit(this.frame?.key);
  }

  constructor(protected elementRef: ElementRef,
              private canvasStore: CanvasStore,
              public dragDropService: DragDropService) {
  }

  ngAfterViewInit(): void {
    console.log('after view init' + this.frame?.key);
    if (this.dropList) {
      this.dragDropService.register(this.dropList);
    }
  }

  @ViewChild(CdkDropList) dropList?: CdkDropList;

  protected onChildClicked(key: string) {
    this.clicked.emit(key);
  }

  protected onChildFrameContentChanged({key, content}: {key: string, content: string}) {
    this.frameContentChanged.emit({key, content});
  }

  protected readonly FlexDirection = FlexDirection;

  getDropListConnectedTo(key: string) {
    return ['canvas-0', 'canvas-1'];//.filter(id => id !== key);
  }

  onChildDrop(event: CdkDragDrop<undefined, undefined>) {
    debugger
    this.onDrop.emit(event);
  }

  allowDropPredicate = (drag: CdkDrag, drop: CdkDropList) => {
    return this.isDropAllowed(drag, drop);
  };

  isDropAllowed(drag: CdkDrag, drop: CdkDropList) {
    if (this.dragDropService.currentHoverDropListId == null) {
      return true;
    }

    return drop.id === this.dragDropService.currentHoverDropListId;
  }

  dragMoved(event: CdkDragMove<undefined>) {
    this.dragDropService.dragMoved(event);
  }

  dragReleased(event: CdkDragRelease) {
    this.dragDropService.dragReleased(event);
  }
}
