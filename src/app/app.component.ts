import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {PropertiesComponent} from "./components/properties/properties.component";
import {AsyncPipe, NgIf} from "@angular/common";
import {ButtonModule} from "primeng/button";
import {StructureTreeComponent} from "./components/structure-tree/structure-tree.component";
import {CanvasStore} from "./store/canvas.store";
import {CanvasComponent} from "./components/canvas/canvas.component";
import {DataService} from "./services/data.service";
import {HeaderComponent} from "./components/header/header.component";
import {ThemeOptionsComponent} from "./components/settings/theme-options.component";
import {SplitterModule} from "primeng/splitter";
import {TabViewModule} from "primeng/tabview";
import {JsonPrismComponent} from "./components/prisms/json-prism.component";
import {CssPrismComponent} from "./components/prisms/css-prism.component";
import {HtmlPrismComponent} from "./components/prisms/html-prism.component";
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
import {UndoRedoDirective} from "./directives/undo-redo.directive";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, PropertiesComponent, AsyncPipe, ButtonModule, StructureTreeComponent, CanvasComponent, HeaderComponent, ThemeOptionsComponent, SplitterModule, TabViewModule, JsonPrismComponent, CssPrismComponent, HtmlPrismComponent, PreviewComponent, NgIf, SelectButtonModule, FormsModule, ToastModule, LeftMenuComponent],
  providers: [CanvasStore, CanvasService, DataService, MessageService, PresetsService, SelectionService, PanZoomService, ContextMenuService, DragDropService, UndoRedoService],
  hostDirectives: [UndoRedoDirective],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  selectedContentId = 1;

  constructor(protected canvasService: CanvasService,
              private selectionService: SelectionService,
              private mockService: DataService) {
    this.fetchData();

    this.selectionService.setSelectedItemKey(this.canvasService.items[0]?.key)
  }

  fetchData() {
    this.canvasService.setItems(this.mockService.getInitialData());
  }
}
