import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CANVAS_WRAPPER_ID} from "../../core/constants";
import {PresetsService} from "./presets.service";
import {CanvasService} from "../../shared/canvas/canvas.service";
import {InsertPosition} from "../../core/enums";

@Component({
    selector: 'app-insert',
    imports: [CommonModule],
    templateUrl: 'insert.component.html',
    styleUrls: [`insert.component.scss`]
})
export class InsertComponent {
  @Input()
  parentFrameId: string | undefined;

  @Input()
  insertPosition: InsertPosition = InsertPosition.AFTER;

  @Output()
  componentAdded = new EventEmitter<boolean>();

  components: any[] = [];

  constructor(private canvasService: CanvasService,
              private presetsService: PresetsService) {
    this.components = this.presetsService.getPresetComponents();
  }

  addItem(event: MouseEvent, presetId: string) {
    this.canvasService.addPreset(presetId, this.parentFrameId || CANVAS_WRAPPER_ID, this.insertPosition);
    this.componentAdded.emit(true);
  }
}
