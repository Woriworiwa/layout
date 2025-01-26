import {
  ChangeDetectionStrategy,
  Component, HostBinding,
  Input
} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ButtonModule} from "primeng/button";
import {OverlayPanelModule} from "primeng/overlaypanel";
import {CanvasItemType} from '../../core/models/enums';
import {CanvasItem} from "../../core/models/canvas-item.model";
import {CssStyleSerializerPipe} from "./css-style-serializer.pipe";
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
