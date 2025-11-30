import { Injectable, Type } from "@angular/core";
import { CanvasItem } from "../../core/models/canvas-item.model";
import { CanvasItemType } from "../../core/enums";
import { flexPresets, textPresets } from "../../../assets/data/presets";
import { Preset } from "../../core/models/preset.model";
import { AssetContainerComponent } from "./asset-container.component";
import { AssetTextComponent } from "./asset-text.component";
import { BoxSizing } from "../../core/models/css/box-sizing";

@Injectable()
export class AssetService {
  private readonly defaultPadding = '16px';

  getAssetComponents() {
    return [...textPresets, ...flexPresets].map(preset => ({
      preset: preset,
      component: this.getAssetComponent(preset.presetDefinition.itemType as CanvasItemType),
      inputs: { preset: preset.presetDefinition }
    }));
  }

  getAssetComponent(type: CanvasItemType): Type<AssetContainerComponent | AssetTextComponent> {
    switch (type) {
      case CanvasItemType.FLEX:
        return AssetContainerComponent;
      case CanvasItemType.TEXT:
        return AssetTextComponent;
      default:
        return AssetContainerComponent;
    }
  }

  getPreset(presetId: string): Preset | undefined {
    return this.getPresets().find(preset => preset.presetId === presetId);
  }

  assignDefaultPaddings(newItem: CanvasItem): void {
    if (newItem.itemType === CanvasItemType.FLEX) {
      const boxSizing: BoxSizing = {
        ...newItem.css?.boxSizing,
        padding: this.defaultPadding
      };
      newItem.css = {
        ...newItem.css,
        boxSizing
      };
    }

    newItem.children?.forEach(frame => {
      this.assignDefaultPaddings(frame);
    });
  }

  private getPresets(): Preset[] {
    return [...flexPresets as Preset[], ...textPresets as Preset[]];
  }
}
