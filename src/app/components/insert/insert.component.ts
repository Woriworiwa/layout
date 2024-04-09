import {Component, EventEmitter, HostListener, Input, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CdkDrag, CdkDropList} from "@angular/cdk/drag-drop";
import {CanvasStore} from "../../store/canvas.store";
import {DataService} from "../../services/data.service";
import {Preset} from "../../models/preset.model";
import {PresetComponent} from "./preset.component";

@Component({
  selector: 'app-insert',
  standalone: true,
  imports: [CommonModule, CdkDrag, CdkDropList, PresetComponent],
  templateUrl: 'insert.component.html',
  styleUrls: [`insert.component.scss`]
})
export class InsertComponent {
  items: Preset[];

  @Input()
  parentFrameId: string | undefined;

  @Output()
  componentAdded = new EventEmitter<boolean>();

  constructor(private canvasStore: CanvasStore,
              private dataService: DataService) {
    this.items = this.dataService.getPresets();
  }

  addItem(presetId: string) {
    this.canvasStore.addNewPreset(presetId, this.parentFrameId!);
    this.componentAdded.emit(true);
  }
}
