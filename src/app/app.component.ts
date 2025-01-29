import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {ButtonModule} from "primeng/button";
import {CanvasStore} from "./core/store/canvas.store";
import {DataService} from "./core/services/data.service";
import {SplitterModule} from "primeng/splitter";
import {TabViewModule} from "primeng/tabview";
import {SelectButtonModule} from "primeng/selectbutton";
import {FormsModule} from "@angular/forms";
import {ToastModule} from "primeng/toast";
import {MessageService} from "primeng/api";
import {UndoRedoService} from "./core/undo-redo/undo-redo.service";
import {PresetsService} from "./designer/insert/presets.service";
import {SelectionService} from "./shared/canvas/selection/selection.service";
import {CanvasService} from "./shared/canvas/canvas.service";
import {ContextMenuService} from "./shared/canvas/context-menu/context-menu.service";
import {DragDropService} from "./shared/canvas/drag-drop.service";
import {UndoRedoDirective} from "./core/undo-redo/undo-redo.directive";
import {AppStateService} from "./core/services/app-state.service";
import {MainAreaContent, SideBarSecondary} from "./core/enums";

@Component({
    selector: 'app-root',
  imports: [RouterOutlet, ButtonModule, SplitterModule, TabViewModule, SelectButtonModule, FormsModule, ToastModule],
    providers: [CanvasStore, CanvasService, DataService, MessageService, PresetsService, SelectionService, ContextMenuService, DragDropService, UndoRedoService],
    hostDirectives: [UndoRedoDirective],
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
  selectedContentId = 1;
  protected readonly MainAreaContent = MainAreaContent;

  constructor(protected canvasService: CanvasService,
              protected appStateService: AppStateService,
              private selectionService: SelectionService,
              private mockService: DataService) {
    this.fetchData();

    this.selectionService.setSelectedItemKey(this.canvasService.items[0]?.key)
  }

  fetchData() {
    this.canvasService.setItems(this.mockService.getInitialData());
  }

  protected readonly SideBarSecondary = SideBarSecondary;
}
