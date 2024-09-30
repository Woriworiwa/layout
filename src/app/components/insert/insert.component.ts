import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PresetContainerComponent} from "./preset-container.component";
import {CANVAS_WRAPPER_ID} from "../../models/constants";
import {PresetsService} from "../../services/presets.service";
import {CanvasService} from "../../services/canvas.service";
import {CssStyleSerializerPipe} from "../../pipes/css-style-serializer.pipe";
import {InsertPosition} from "../../models/enums";

@Component({
  selector: 'app-insert',
  standalone: true,
  imports: [CommonModule, PresetContainerComponent, CssStyleSerializerPipe],
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
