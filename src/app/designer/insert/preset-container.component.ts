import { ChangeDetectionStrategy, Component, HostBinding, Input, inject } from '@angular/core';
import {CommonModule} from '@angular/common';
import {ButtonModule} from "primeng/button";
import {OverlayPanelModule} from "primeng/overlaypanel";
import {CanvasItemType} from '../../core/enums';
import {CanvasItem} from "../../core/models/canvas-item.model";
import {CssStyleSerializerPipe} from "../../core/serialization/css-style-serializer.pipe";
import {PresetsService} from "./presets.service";

@Component({
    selector: 'app-preset-container',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CommonModule, ButtonModule, OverlayPanelModule],
    providers: [CssStyleSerializerPipe],
    template: `
    @switch (preset?.itemType) {
      @case (FrameType.FLEX) {
        @for (childFrame of preset?.children; track childFrame) {
          <ng-container *ngComponentOutlet="presetsService.getPresetComponent(childFrame.itemType); inputs: {preset: childFrame}" />
        }
      }
    }
  `,
    styles: [`
    :host {
      zoom: 70%;
    }
  `]
})
export class PresetContainerComponent {
  private cssStyleSerializerPipe = inject(CssStyleSerializerPipe);
  protected presetsService = inject(PresetsService);

  protected readonly FrameType = CanvasItemType;

  @Input()
  preset: CanvasItem | undefined;

  @HostBinding('style')
  get myStyle() {
    return this.cssStyleSerializerPipe.transform(this.preset)
  }
}
