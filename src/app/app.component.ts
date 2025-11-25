import { Component, inject } from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {CanvasStore} from "./core/store/canvas.store";
import {DataService} from "./core/services/data.service";
import {MessageService} from "primeng/api";
import {UndoRedoService} from "./core/undo-redo/undo-redo.service";
import {PresetsService} from "./designer/insert/presets.service";
import {SelectionService} from "./canvas/selection/selection.service";
import {CanvasService} from "./canvas/canvas.service";
import {ContextMenuService} from "./canvas/context-menu/context-menu.service";
import {DragDropService} from "./canvas/drag-drop.service";
import {UndoRedoDirective} from "./core/undo-redo/undo-redo.directive";
import {AppStateService} from "./core/services/app-state.service";
import {MainAreaContent, SideBarSecondary} from "./core/enums";

@Component({
    selector: 'app-root',
  imports: [RouterOutlet],
    providers: [CanvasStore, CanvasService, DataService, MessageService, PresetsService, SelectionService, ContextMenuService, DragDropService, UndoRedoService],
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
