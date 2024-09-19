import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CanvasStore} from "../../store/canvas.store";
import {Preset} from "../../models/preset.model";
import {PresetComponent} from "./preset.component";

@Component({
  selector: 'app-insert',
  standalone: true,
  imports: [CommonModule, PresetComponent],
  templateUrl: 'insert.component.html',
  styleUrls: [`insert.component.scss`]
})
export class InsertComponent {
  @Input()
  parentFrameId: string | undefined;

  @Output()
  componentAdded = new EventEmitter<boolean>();

  items: Preset[];

  constructor(private canvasStore: CanvasStore) {
    this.items = this.canvasStore.getPresets();
  }

  addItem(presetId: string) {
    if (!this.parentFrameId) {
      return;
    }

    this.canvasStore.addNewPreset(presetId, this.parentFrameId);
    this.componentAdded.emit(true);
  }
}
