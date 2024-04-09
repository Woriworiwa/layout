import {
  ChangeDetectionStrategy,
  Component, ElementRef,
  EventEmitter, HostBinding,
  HostListener,
  Input,
  Output
} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ButtonModule} from "primeng/button";
import {OverlayPanelModule} from "primeng/overlaypanel";
import { FrameType } from '../../models/enums';
import {Frame} from "../../models/frame.model";
import {CanvasStore} from "../../store/canvas.store";
import {TextComponent} from "../canvas-components/text/text.component";
import {DisplayFlexDirective} from "../../directives/display-flex.directive";

@Component({
  selector: 'app-preset',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ButtonModule, OverlayPanelModule, TextComponent, DisplayFlexDirective],
  templateUrl: 'preset.component.html',
  styleUrls: ['./preset.component.scss'],
})
export class PresetComponent {
  protected readonly FrameType = FrameType;
  @Input() preset: Frame | undefined;
}
