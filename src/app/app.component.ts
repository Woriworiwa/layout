import {Component} from '@angular/core';
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

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, PropertiesComponent, AsyncPipe, ButtonModule, StructureTreeComponent, CanvasComponent, HeaderComponent, ThemeOptionsComponent, SplitterModule, TabViewModule, JsonPrismComponent, CssPrismComponent, HtmlPrismComponent, PreviewComponent, NgIf, SelectButtonModule, FormsModule],
  providers: [CanvasStore, DataService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'layout';
  frame: CanvasItem | undefined;

  selectedTabId = 1;

  tabs: any[] = [
    { label: 'Canvas', id: 1, icon:'pi pi-palette' },
    { label: 'HTML', id: 2, icon:'pi pi-receipt'},
    { label: 'JSON', id: 3,icon:'pi pi-file' }
  ];

  constructor(protected canvasStore: CanvasStore,
              protected appSettingsStore: AppSettingsStore,
              private mockService: DataService) {
    this.fetchData();

    this.canvasStore.setSelectedFrameKey(this.canvasStore.frames[0]?.key)
  }

  fetchData() {
    this.canvasStore.frames = this.mockService.getInitialData();
  }

  setSelectedTab(id: number) {
    this.selectedTabId = id;
  }
}
