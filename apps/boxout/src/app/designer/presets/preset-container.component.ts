import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  Input,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { CanvasItemType } from '@layout/models';
import { CanvasItem } from '@layout/models';
import { PresetService } from './preset.service';
import { CssStyleSerializerPipe } from './css-style-serializer.pipe';

@Component({
  selector: 'app-preset-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  providers: [CssStyleSerializerPipe],
  template: `
    @switch (preset?.itemType) {
      @case (FrameType.CONTAINER) {
        @for (childFrame of preset?.children; track childFrame) {
          <ng-container
            *ngComponentOutlet="
              presetsService.getAssetComponent(childFrame.itemType);
              inputs: { preset: childFrame }
            "
          />
        }
      }
    }
  `,
  styles: [
    `
      :host {
        zoom: 50%;
      }
    `,
  ],
})
export class PresetContainerComponent {
  private cssStyleSerializerPipe = inject(CssStyleSerializerPipe);
  protected presetsService = inject(PresetService);

  protected readonly FrameType = CanvasItemType;

  @Input()
  preset: CanvasItem | undefined;

  @HostBinding('style')
  get myStyle() {
    return this.cssStyleSerializerPipe.transform(this.preset);
  }
}
