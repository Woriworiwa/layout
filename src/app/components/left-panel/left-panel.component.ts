import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {StructureTreeComponent} from "../structure-tree/structure-tree.component";
import {InsertComponent} from "../insert/insert.component";
import {ToggleButtonModule} from "primeng/togglebutton";
import {FormsModule} from "@angular/forms";
import {CdkDragDrop, CdkDropList} from "@angular/cdk/drag-drop";
import {CanvasStore} from "../../store/canvas.store";
import {AppSettingsStore} from "../../store/app-settings-store.service";

@Component({
  selector: 'app-left-panel',
  standalone: true,
  imports: [CommonModule, StructureTreeComponent, InsertComponent, ToggleButtonModule, FormsModule, CdkDropList],
  templateUrl: './left-panel.component.html',
  styleUrl: './left-panel.component.scss'
})
export class LeftPanelComponent {
  insertModeActive = false;
  insertModeDragging = false;

  constructor(private canvasStore: CanvasStore,
              private appSettingsStore: AppSettingsStore) {
  }

  get isInsertPanelActive(): boolean {
    return this.appSettingsStore.addItemsPanelActive;
  }

  set isInsertPanelActive(isActive: boolean) {
    this.appSettingsStore.addItemsPanelActive = isActive;
  }

  ngOnInit() {
    this.appSettingsStore.addItemsPanelActive$.subscribe((active) => {
      this.isInsertPanelActive = active;
    });
  }

  onDragNewElementStarted() {
    this.appSettingsStore.addItemsPanelActive = false;
  }

  onAddNewItemDrop(event: CdkDragDrop<string[]>) {
    if (event.item.data) {
      const frameId = this.getAddNewItemDropData(event.event.target as HTMLElement);

      if (frameId) {
        this.canvasStore.addNewPreset(event.item.data, frameId, event.currentIndex);
      }
    }
  }

  private getAddNewItemDropData(element :HTMLElement | null | undefined): string {
    if (element?.dataset['id']) {
      return element?.dataset['id'];
    } else {
      return this.getAddNewItemDropData(element?.parentElement);
    }
  }
}
