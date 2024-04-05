import {Component, EventEmitter, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CdkDrag, CdkDropList} from "@angular/cdk/drag-drop";
import {CanvasStore} from "../../store/canvas.store";
import {CANVAS_WRAPPER_ID} from "../../models/constants";
import {FrameType} from "../../models/enums";
import {DataService} from "../../services/data.service";
import {Preset} from "../../models/preset.model";

@Component({
  selector: 'app-insert',
  standalone: true,
  imports: [CommonModule, CdkDrag, CdkDropList],
  template: `
      <div [cdkDropListConnectedTo]="frameIds"
           class="items-list"
           cdkDropList
           cdkDropListSortingDisabled="true">
        @for (item of items; track item) {
          <div class="item"
               cdkDrag
               [cdkDragData]="item.presetId"
               (cdkDragStarted)="onDragStarted()"
               (cdkDragEnded)="onDragEnded()">
            {{item.presetName}}
          </div>
        }
      </div>
  `,
  styles: `
    :host {
      display: flex;
      justify-content: start;
      position: relative;
      z-index: 2;
    }

    .wrapper {
      margin: 0 25px 25px 0;
      display: flex;
    }

    .items-list {
      background: white;
      border-radius: 4px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      gap: 20px;
      flex-grow: 1;
      padding: 20px;
    }

    .item {
      padding: 20px 10px;
      background: #f3f3f3;
      border-radius: 4px;
      padding: 20px;
    }

    .item {
      cursor: move;
    }
  `
})
export class InsertComponent {
  frameIds: string[] = [];

  items: Preset[];

  @Output()
  dragStarted = new EventEmitter<void>();

  @Output()
  dragEnded = new EventEmitter<void>();

  constructor(private canvasStore: CanvasStore,
              private dataService: DataService) {
    this.items = this.dataService.getPresets();
  }

  ngOnInit() {
    this.canvasStore.frameIds$
      .subscribe(ids => {
        this.frameIds = [...ids, CANVAS_WRAPPER_ID, 'structure-tree-drop-wrapper'];
        console.log(ids);
      })
  }


  onDragStarted() {
    this.dragStarted.emit();
  }

  onDragEnded() {
    this.dragEnded.emit();
  }
}
