import {
  ChangeDetectionStrategy,
  Component, ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output
} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Frame, FrameType} from "../core/models/frame.model";
import {FlexItemComponent} from "./flex/flex-item.component";
import {NbCardModule} from "@nebular/theme";
import {FlexContainerComponent} from "./flex/flex-container.component";
import {EditorContentDirective} from "./editorcontent.directive";

@Component({
  selector: 'app-frame',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FlexItemComponent, NbCardModule, FlexContainerComponent, EditorContentDirective],
  host: {
    '[class.selected]' : 'selectedFrameKey === frame?.key'
  },
  hostDirectives: [{
    directive: EditorContentDirective,
    outputs: ['frameContentChanged'],
  }],
  templateUrl: 'frame.component.html',
  styleUrls: ['./frame.component.scss'],
})
export class FrameComponent {
  protected readonly FrameType = FrameType;
  @Input() frame: Frame | undefined;
  @Input() selectedFrameKey!: string | undefined;
  @Output() clicked = new EventEmitter<string>();
  @Output() frameContentChanged = new EventEmitter<{ key: string , content: string }>();

  @HostListener('click', ['$event'])
  onClick($event:any) {
    $event.stopPropagation();
    this.clicked.emit(this.frame?.key);
  }

  constructor(protected elementRef: ElementRef) {
  }

  protected onChildClicked(key: string) {
    this.clicked.emit(key);
  }

  protected onChildFrameContentChanged({key, content}: {key: string, content: string}) {
    this.frameContentChanged.emit({key, content});
  }
}
