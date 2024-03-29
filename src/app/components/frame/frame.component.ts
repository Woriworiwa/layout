import {
  ChangeDetectionStrategy,
  Component, ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output
} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Frame} from "../../models/frame.model";
import {EditorContentDirective} from "../../directives/editorcontent.directive";
import {FlexDirective} from "../../directives/flex.directive";
import {TextComponent} from "../text/text.component";
import { FrameType } from '../../models/enums';

@Component({
  selector: 'app-frame',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, EditorContentDirective, FlexDirective, TextComponent],
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
