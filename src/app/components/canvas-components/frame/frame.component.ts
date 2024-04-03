import {
  ChangeDetectionStrategy,
  Component, ElementRef,
  EventEmitter,
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

@Component({
  selector: 'app-frame',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, EditorContentDirective, DisplayFlexDirective, TextComponent, CdkDrag, CdkDropList],
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
  @Input() dragDropDisabled = true;
  @Output() clicked = new EventEmitter<string>();
  @Output() frameContentChanged = new EventEmitter<{ key: string , content: string }>();

  @HostListener('click', ['$event'])
  onClick($event:any) {
    $event.stopPropagation();
    this.clicked.emit(this.frame?.key);
  }

  constructor(private canvasStore: CanvasStore) {
  }

  onDrop(event: CdkDragDrop<string[]>) {
    this.canvasStore.addNewPreset(event.item.data, event.container.id, event.currentIndex);
  }

  protected onChildClicked(key: string) {
    this.clicked.emit(key);
  }

  protected onChildFrameContentChanged({key, content}: {key: string, content: string}) {
    this.frameContentChanged.emit({key, content});
  }
}
