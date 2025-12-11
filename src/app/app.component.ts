import { Component, inject } from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {CanvasStore} from "./canvas/canvas.store";
import {DataService} from "./core/services/data.service";
import {MessageService} from "primeng/api";
import {UndoRedoService} from "./core/undo-redo/undo-redo.service";
import {PresetService} from "./designer/presets/preset.service";
import {SelectionService} from "./canvas/selection/selection.service";
import {CanvasService} from "./canvas/canvas.service";
import {ContextMenuService} from "./canvas/context-menu/context-menu.service";
import {UndoRedoDirective} from "./core/undo-redo/undo-redo.directive";

@Component({
    selector: 'app-root',
  imports: [RouterOutlet],
    providers: [CanvasStore, CanvasService, DataService, MessageService, PresetService, SelectionService, ContextMenuService, UndoRedoService],
    hostDirectives: [UndoRedoDirective],
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
  protected canvasService = inject(CanvasService);
  private selectionService = inject(SelectionService);
  private mockService = inject(DataService);

  constructor() {
    this.fetchData();

    this.selectionService.setSelectedItemKey(this.canvasService.items[0]?.key)
  }

  fetchData() {
    this.canvasService.setItems(this.mockService.getInitialData());
  }
}
