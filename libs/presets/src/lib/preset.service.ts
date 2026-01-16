import { Injectable } from '@angular/core';
import { CanvasItem, CanvasItemType, Spacing } from '@layout/models';
import { PresetProvider } from '@layout/shared';
import { allPresets } from '@layout/presets';
import {
  Preset,
  PresetCategory,
  PresetFolder,
} from '@layout/models';
import { PresetContainerComponent } from './components/preset-container.component';
import { PresetTextComponent } from './components/preset-text.component';

@Injectable()
export class PresetService implements PresetProvider {
  defaultPadding = '16px';
  allPresets: Preset[] = [...allPresets] as Preset[];

  getAssetComponent(type: CanvasItemType) {
    switch (type) {
      case CanvasItemType.CONTAINER:
        return PresetContainerComponent;
      case CanvasItemType.TEXT:
        return PresetTextComponent;
      default:
        return PresetContainerComponent;
    }
  }

  getPreset(presetId: string) {
    return this.allPresets.find((preset) => preset.presetId === presetId);
  }

  assignDefaultPaddings(newItem: CanvasItem) {
    if (newItem.itemType === CanvasItemType.CONTAINER) {
      const spacing: Spacing = {
        ...newItem.css?.spacing,
        padding: this.defaultPadding,
      };
      newItem.css = {
        ...newItem.css,
        spacing,
      };
    }

    newItem.children?.forEach((frame) => {
      this.assignDefaultPaddings(frame);
    });
  }

  getPresetFolders(): { rootPresets: Preset[]; folders: PresetFolder[] } {
    const rootPresets = this.allPresets.filter(
      (p) => !p.category || p.category === PresetCategory.ROOT,
    );

    const folderMap = new Map<PresetCategory, Preset[]>();

    this.allPresets.forEach((preset) => {
      if (preset.category && preset.category !== PresetCategory.ROOT) {
        if (!folderMap.has(preset.category)) {
          folderMap.set(preset.category, []);
        }
        folderMap.get(preset.category)?.push(preset);
      }
    });

    const folders: PresetFolder[] = Array.from(folderMap.entries()).map(
      ([category, presets]) => ({
        id: category,
        label: this.getFolderLabel(category),
        icon: this.getFolderIcon(category),
        presets,
      }),
    );

    const folderOrder = [
      PresetCategory.FLEXBOX,
      PresetCategory.GRID,
      PresetCategory.LAYOUTS,
      PresetCategory.COMPONENTS,
    ];

    folders.sort(
      (a, b) => folderOrder.indexOf(a.id) - folderOrder.indexOf(b.id),
    );

    return { rootPresets, folders };
  }

  private getFolderLabel(category: PresetCategory): string {
    const labels: Record<PresetCategory, string> = {
      [PresetCategory.ROOT]: '',
      [PresetCategory.FLEXBOX]: 'Flexbox',
      [PresetCategory.GRID]: 'Grid',
      [PresetCategory.LAYOUTS]: 'Layouts',
      [PresetCategory.COMPONENTS]: 'Components',
    };
    return labels[category] || category;
  }

  private getFolderIcon(category: PresetCategory): string {
    const icons: Record<PresetCategory, string> = {
      [PresetCategory.ROOT]: '',
      [PresetCategory.FLEXBOX]: 'pi pi-directions',
      [PresetCategory.GRID]: 'pi pi-th-large',
      [PresetCategory.LAYOUTS]: 'pi pi-window-maximize',
      [PresetCategory.COMPONENTS]: 'pi pi-box',
    };
    return icons[category] || 'pi pi-folder';
  }
}
