import { ChangeDetectionStrategy, Component, HostBinding, input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CanvasItemType } from '../../core/enums';
import { CanvasItem } from "../../core/models/canvas-item.model";
import { CssStyleSerializerPipe } from "../../core/serialization/css-style-serializer.pipe";
import { AssetService } from "./asset.service";

@Component({
  selector: 'app-asset-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  providers: [CssStyleSerializerPipe],
  template: `
    @switch (preset()?.itemType) {
      @case (FrameType.FLEX) {
        @for (childFrame of preset()?.children; track childFrame.key) {
          <ng-container
            *ngComponentOutlet="assetService.getAssetComponent(childFrame.itemType); inputs: {preset: childFrame}" />
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
export class AssetContainerComponent {
  private readonly cssStyleSerializerPipe = inject(CssStyleSerializerPipe);
  protected readonly assetService = inject(AssetService);

  protected readonly FrameType = CanvasItemType;

  preset = input<CanvasItem | undefined>(undefined);

  @HostBinding('style')
  protected get hostStyle(): string {
    return this.cssStyleSerializerPipe.transform(this.preset());
  }
}
