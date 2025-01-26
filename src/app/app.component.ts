import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {PropertiesComponent} from "./properties/properties.component";
import {NgTemplateOutlet} from "@angular/common";
import {ButtonModule} from "primeng/button";
import {CanvasStore} from "./core/store/canvas.store";
import {CanvasComponent} from "./canvas/canvas.component";
import {DataService} from "./core/services/data.service";
import {HeaderComponent} from "./panels/header/header.component";
import {SplitterModule} from "primeng/splitter";
import {TabViewModule} from "primeng/tabview";
import {JsonPrismComponent} from "./serialization/prisms/json-prism.component";
import {CssPrismComponent} from "./serialization/prisms/css-prism.component";
import {HtmlPrismComponent} from "./serialization/prisms/html-prism.component";
import {PreviewComponent} from "./preview/preview.component";
import {SelectButtonModule} from "primeng/selectbutton";
import {FormsModule} from "@angular/forms";
import {ToastModule} from "primeng/toast";
import {MessageService} from "primeng/api";
import {UndoRedoService} from "./core/undo-redo/undo-redo.service";
import {PresetsService} from "./panels/insert/presets.service";
import {SelectionService} from "./canvas/selection/selection.service";
import {CanvasService} from "./canvas/canvas.service";
import {ContextMenuService} from "./canvas/context-menu/context-menu.service";
import {DragDropService} from "./canvas/drag-drop.service";
import {UndoRedoDirective} from "./core/undo-redo/undo-redo.directive";
import {SideBarComponent} from "./panels/side-bar/side-bar.component";
import {AppStateService} from "./core/services/app-state.service";
import {MainAreaContent, SideBarSecondary} from "./core/enums";

@Component({
    selector: 'app-root',
  imports: [RouterOutlet, PropertiesComponent, ButtonModule, CanvasComponent, HeaderComponent, SplitterModule, TabViewModule, JsonPrismComponent, CssPrismComponent, HtmlPrismComponent, PreviewComponent, SelectButtonModule, FormsModule, ToastModule, SideBarComponent, NgTemplateOutlet],
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
