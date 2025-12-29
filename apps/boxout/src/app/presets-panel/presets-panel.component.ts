import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  output,
  Type,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PresetService } from '@layout/presets';
import { PresetFolderStateService } from './preset-folder-state.service';
import {
  AssetDragDropService,
  CanvasService,
  SelectionService,
} from '@layout/canvas';
import {
  CanvasItem,
  CanvasItemType,
  InsertPosition,
  Preset,
  PresetCategory,
  PresetFolder,
} from '@layout/models';
import { PresetAiComponent } from './components/preset-ai.component';
import { PresetTextComponent } from './components/preset-text.component';

interface AssetComponentItem {
  preset: Preset;
  component: Type<unknown>;
  inputs: { preset: CanvasItem };
}

@Component({
  selector: 'app-presets-panel',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule],
  providers: [PresetFolderStateService],
  templateUrl: 'presets-panel.component.html',
  styleUrls: ['presets-panel.component.scss'],
  host: {
    'data-testid': 'components-panel-component',
  },
})
export class PresetsPanelComponent {
  private readonly canvasService = inject(CanvasService);
  private readonly presetsService = inject(PresetService);
  private readonly selectionService = inject(SelectionService);
  private readonly assetDragDropService = inject(AssetDragDropService);
  private readonly folderStateService = inject(PresetFolderStateService);

  parentFrameId = input<string | undefined>(undefined);
  insertPosition = input<InsertPosition>(InsertPosition.AFTER);

  componentAdded = output<boolean>();

  protected readonly rootPresets: readonly AssetComponentItem[];
  protected readonly folders: readonly PresetFolder[];

  // Computed: Check if there's a selected item
  protected hasSelection = computed(() => {
    return this.selectionService.selectedItem !== undefined;
  });

  constructor() {
    const { rootPresets, folders } = this.presetsService.getPresetFolders();

    this.rootPresets = rootPresets.map((preset) => ({
      preset,
      component: this.getComponentForPreset(preset),
      inputs: { preset: preset.presetDefinition },
    }));

    this.folders = folders;
  }

  private getComponentForPreset(preset: Preset): Type<unknown> {
    if (preset.presetDefinition.aiMetadata) {
      return PresetAiComponent;
    }

    if (preset.presetDefinition.itemType === CanvasItemType.TEXT){
      return PresetTextComponent;
    }

    return this.presetsService.getAssetComponent(
      preset.presetDefinition.itemType as CanvasItemType,
    );
  }

  protected toggleFolder(categoryId: PresetCategory): void {
    this.folderStateService.toggleFolder(categoryId);
  }

  protected isFolderExpanded(categoryId: PresetCategory): boolean {
    return this.folderStateService.isExpanded(categoryId);
  }

  protected getPresetsForFolder(folder: PresetFolder): AssetComponentItem[] {
    return folder.presets.map((preset) => ({
      preset,
      component: this.getComponentForPreset(preset),
      inputs: { preset: preset.presetDefinition },
    }));
  }

  protected onDragStart(event: DragEvent, presetId: string): void {
    if (!event.dataTransfer) {
      return;
    }

    // Set drag data
    event.dataTransfer.effectAllowed = 'copy';
    event.dataTransfer.setData('application/x-asset-preset', presetId);

    // Start tracking drag state
    this.assetDragDropService.startDragging(presetId);

    // Add visual feedback
    const target = event.currentTarget as HTMLElement;
    target.style.opacity = '0.5';

    // Position drag image below cursor to avoid obscuring drop location
    // setDragImage(element, offsetX, offsetY) where offset is from cursor position
    event.dataTransfer.setDragImage(target, 0, -10);
  }

  protected onDragEnd(event: DragEvent): void {
    // Reset visual feedback
    const target = event.currentTarget as HTMLElement;
    target.style.opacity = '1';

    // Handle drop if we have valid drop data
    const dropData = this.assetDragDropService.getDropData();
    if (dropData) {
      this.canvasService.addPreset(
        dropData.presetId,
        dropData.targetId,
        dropData.position,
      );
      this.componentAdded.emit(true);
    }

    // End tracking drag state
    this.assetDragDropService.endDragging();
  }
}
