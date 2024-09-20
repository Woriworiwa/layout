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

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, PropertiesComponent, AsyncPipe, ButtonModule, StructureTreeComponent, CanvasComponent, HeaderComponent, ThemeOptionsComponent, SplitterModule, TabViewModule, JsonPrismComponent, CssPrismComponent, HtmlPrismComponent, PreviewComponent, NgIf, SelectButtonModule, FormsModule, ToastModule, LeftMenuComponent],
  providers: [CanvasStore, DataService, MessageService],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'layout';
  frame: CanvasItem | undefined;

  selectedTabId = 1;

  tabs: { label: string, id: number, icon: string }[] = [
    { label: 'Canvas', id: 1, icon:'pi pi-palette' },
    { label: 'iFrame', id: 2, icon:'pi pi-palette' },
    { label: 'CSS', id: 3, icon:'pi pi-receipt'},
    { label: 'HTML', id: 4, icon:'pi pi-receipt'},
    { label: 'JSON', id: 5,icon:'pi pi-file' }
  ];

  constructor(protected canvasStore: CanvasStore,
              protected appSettingsStore: AppSettingsStore,
              private undoRedoService: UndoRedoService,
              private mockService: DataService) {
    this.fetchData();

    this.canvasStore.setSelectedCanvasItemKey(this.canvasStore.canvasItems[0]?.key)
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
    this.canvasStore.setCanvasItems(this.mockService.getInitialData());
  }

  setSelectedTab(id: number) {
    this.selectedTabId = id;
  }
}
