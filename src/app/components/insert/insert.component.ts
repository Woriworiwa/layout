import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Preset} from "../../models/preset.model";
import {PresetComponent} from "./preset.component";
import {CANVAS_WRAPPER_ID} from "../../models/constants";
import {PresetsService} from "../../services/presets.service";
import {CanvasService} from "../../services/canvas.service";

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

  constructor(private canvasService: CanvasService,
              private presetsService: PresetsService) {
    this.items = this.presetsService.getPresets();
  }

  addItem(presetId: string) {
    this.canvasService.addPreset(presetId, this.parentFrameId || CANVAS_WRAPPER_ID);
    this.componentAdded.emit(true);
  }
}
