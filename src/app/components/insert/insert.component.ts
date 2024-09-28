import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Preset} from "../../models/preset.model";
import {PresetContainerComponent} from "./preset-container.component";
import {CANVAS_WRAPPER_ID} from "../../models/constants";
import {PresetsService} from "../../services/presets.service";
import {CanvasService} from "../../services/canvas.service";
import {CssStyleSerializerPipe} from "../../pipes/css-style-serializer.pipe";

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

  @Output()
  componentAdded = new EventEmitter<boolean>();

  components: any[] = [];

  constructor(private canvasService: CanvasService,
              private presetsService: PresetsService) {
    this.components = this.presetsService.getPresetComponents();
  }

  addItem(presetId: string) {
    this.canvasService.addPreset(presetId, this.parentFrameId || CANVAS_WRAPPER_ID);
    this.componentAdded.emit(true);
  }
}
