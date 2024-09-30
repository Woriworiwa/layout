import {Component, HostListener} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {PropertiesComponent} from "./components/properties/properties.component";
import {AsyncPipe, NgIf} from "@angular/common";
import {ButtonModule} from "primeng/button";
import {StructureTreeComponent} from "./components/structure-tree/structure-tree.component";
import {CanvasStore} from "./store/canvas.store";
import {CanvasComponent} from "./components/canvas/canvas.component";
import {DataService} from "./services/data.service";
import {CanvasItem} from "./models/canvas-item.model";
import {HeaderComponent} from "./components/header/header.component";
import {ThemeOptionsComponent} from "./components/settings/theme-options.component";
import {SplitterModule} from "primeng/splitter";
import {TabViewModule} from "primeng/tabview";
import {JsonPrismComponent} from "./components/prisms/json-prism.component";
import {CssPrismComponent} from "./components/prisms/css-prism.component";
import {HtmlPrismComponent} from "./components/prisms/html-prism.component";
import {AppSettingsStore} from "./store/app-settings-store.service";
import {PreviewComponent} from "./components/preview/preview.component";
import {SelectButtonModule} from "primeng/selectbutton";
import {FormsModule} from "@angular/forms";
import {ToastModule} from "primeng/toast";
import {MessageService} from "primeng/api";
import {UndoRedoService} from "./services/undo-redo.service";
import {LeftMenuComponent} from "./components/left-menu/left-menu.component";
import {PresetsService} from "./services/presets.service";
import {SelectionService} from "./services/selection.service";
import {CanvasService} from "./services/canvas.service";
import {PanZoomService} from "./services/pan-zoom.service";
import {ContextMenuService} from "./services/context-menu.service";
import {DragDropService} from "./services/drag-drop.service";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, PropertiesComponent, AsyncPipe, ButtonModule, StructureTreeComponent, CanvasComponent, HeaderComponent, ThemeOptionsComponent, SplitterModule, TabViewModule, JsonPrismComponent, CssPrismComponent, HtmlPrismComponent, PreviewComponent, NgIf, SelectButtonModule, FormsModule, ToastModule, LeftMenuComponent],
  providers: [CanvasStore, CanvasService, DataService, MessageService, PresetsService, SelectionService, PanZoomService, ContextMenuService, DragDropService, UndoRedoService],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'layout';
  frame: CanvasItem | undefined;
  selectedContentId = 1;


  constructor(protected canvasService: CanvasService,
              protected appSettingsStore: AppSettingsStore,
              private undoRedoService: UndoRedoService,
              private selectionService: SelectionService,
              private mockService: DataService) {
    this.fetchData();

    this.selectionService.setSelectedItemKey(this.canvasService.items[0]?.key)
  }

  /* undo */
  @HostListener('document:keydown.control.z', ['$event'])
  onUndo($event: KeyboardEvent) {
    $event.stopPropagation();
    this.undoRedoService.undo();
  }

  /* redo */
  @HostListener('document:keydown.control.y', ['$event'])
  onRedo($event: KeyboardEvent) {
    $event.stopPropagation();
    this.undoRedoService.redo();
  }

  fetchData() {
    this.canvasService.setItems(this.mockService.getInitialData());
  }
}
