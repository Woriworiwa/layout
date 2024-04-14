import {
  ChangeDetectionStrategy,
  Component,
  Input
} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ButtonModule} from "primeng/button";
import {OverlayPanelModule} from "primeng/overlaypanel";
import { FrameType } from '../../models/enums';
import {CanvasItem} from "../../models/canvas-item.model";
import {TextComponent} from "../canvas-components/text/text.component";
import {CssPipe} from "../../pipes/css.pipe";

@Component({
  selector: 'app-preset',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ButtonModule, OverlayPanelModule, TextComponent, CssPipe],
  templateUrl: 'preset.component.html',
  styleUrls: ['./preset.component.scss'],
})
export class PresetComponent {
  protected readonly FrameType = FrameType;
  @Input() preset: CanvasItem | undefined;
}
