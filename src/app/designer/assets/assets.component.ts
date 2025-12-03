import { ChangeDetectionStrategy, Component, Type, input, output, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectButton } from 'primeng/selectbutton';
import { FormsModule } from '@angular/forms';
import { CANVAS_WRAPPER_ID } from "../../core/constants";
import { AssetService } from "./asset.service";
import { CanvasService } from "../../canvas/canvas.service";
import { InsertPosition } from "../../core/enums";
import { CanvasItem } from "../../core/models/canvas-item.model";
import { Preset } from '../../core/models/preset.model';
import { SelectionService } from "../../canvas/selection/selection.service";
import { AssetDragDropService } from "./asset-drag-drop.service";

interface AssetComponentItem {
  preset: Preset;
  component: Type<unknown>;
  inputs: { preset: CanvasItem };
}

@Component({
  selector: 'app-insert',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, SelectButton, FormsModule],
  templateUrl: 'assets.component.html',
  styleUrls: ['assets.component.scss']
})
export class AssetsComponent {
  private readonly canvasService = inject(CanvasService);
  private readonly presetsService = inject(AssetService);
  private readonly selectionService = inject(SelectionService);
  private readonly assetDragDropService = inject(AssetDragDropService);

  parentFrameId = input<string | undefined>(undefined);
  insertPosition = input<InsertPosition>(InsertPosition.AFTER);

  componentAdded = output<boolean>();

  protected readonly components: readonly AssetComponentItem[];
  protected readonly insertPositionEnum = InsertPosition;

  protected selectedInsertPosition = signal<InsertPosition>(InsertPosition.INSIDE);

  protected insertPositions = [
    { label: 'Before', value: InsertPosition.BEFORE, icon: 'pi pi-angle-up' },
    { label: 'Inside', value: InsertPosition.INSIDE, icon: 'pi pi-plus' },
    { label: 'After', value: InsertPosition.AFTER, icon: 'pi pi-angle-down' }
  ];

  // Computed: Check if there's a selected item
  protected hasSelection = computed(() => {
    return this.selectionService.selectedItem !== undefined;
  });

  constructor() {
    this.components = this.presetsService.getAssetComponents() as AssetComponentItem[];
  }

  protected addItem(presetId: string): void {
    const hasSelectedItem = this.selectionService.selectedItem !== undefined;
    const targetId = hasSelectedItem
      ? this.selectionService.selectedItem?.key || CANVAS_WRAPPER_ID
      : CANVAS_WRAPPER_ID;

    const position = hasSelectedItem
      ? this.selectedInsertPosition()
      : InsertPosition.AFTER; // Insert at end if no selection

    this.canvasService.addPreset(
      presetId,
      targetId,
      position
    );
    this.componentAdded.emit(true);
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
        dropData.position
      );
      this.componentAdded.emit(true);
    }

    // End tracking drag state
    this.assetDragDropService.endDragging();
  }
}
