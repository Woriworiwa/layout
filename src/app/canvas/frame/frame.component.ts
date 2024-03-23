import {
  ChangeDetectionStrategy,
  Component, ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output
} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Frame} from "../../core/frame.model";
import {NbCardModule} from "@nebular/theme";
import {EditorContentDirective} from "../../directives/editorcontent.directive";
import {FlexDirective} from "../../directives/flex.directive";
import {TextComponent} from "../text.component";
import { FrameType } from '../../core/enums';

@Component({
  selector: 'app-frame',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, NbCardModule, EditorContentDirective, FlexDirective, TextComponent],
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
