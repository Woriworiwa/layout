import {
  ChangeDetectionStrategy,
  Component, HostBinding,
  Input
} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ButtonModule} from "primeng/button";
import {OverlayPanelModule} from "primeng/overlaypanel";
import {CanvasItemType} from '../../models/enums';
import {CanvasItem} from "../../models/canvas-item.model";
import {CssStyleSerializerPipe} from "../../pipes/css-style-serializer.pipe";
import {PresetTextComponent} from "./preset-text.component";
import {PresetsService} from "../../services/presets.service";

@Component({
  selector: 'app-preset-container',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ButtonModule, OverlayPanelModule, CssStyleSerializerPipe, PresetTextComponent],
  providers: [CssStyleSerializerPipe],
  template: `
    @switch (preset?.itemType) {
      @case (FrameType.FLEX) {
        @for (childFrame of preset?.children; track childFrame) {
          <ng-container *ngComponentOutlet="presetsService.getPresetComponent(childFrame.itemType); inputs: {preset: childFrame}" />
        }
      }
    }
  `
})
export class PresetContainerComponent {
  protected readonly FrameType = CanvasItemType;

  @Input()
  preset: CanvasItem | undefined;

  @HostBinding('style')
  get myStyle() {
    return this.cssStyleSerializerPipe.transform(this.preset)
  }

  constructor(private cssStyleSerializerPipe: CssStyleSerializerPipe,
              protected presetsService: PresetsService) {
  }
}
