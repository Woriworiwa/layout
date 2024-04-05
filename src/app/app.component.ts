import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {PropertiesComponent} from "./components/properties/properties.component";
import {AsyncPipe} from "@angular/common";
import {ButtonModule} from "primeng/button";
import {StructureTreeComponent} from "./components/structure-tree/structure-tree.component";
import {CanvasStore} from "./store/canvas.store";
import {CanvasComponent} from "./components/canvas/canvas.component";
import {DataService} from "./services/data.service";
import {Frame} from "./models/frame.model";
import {HeaderComponent} from "./components/header/header.component";
import {ThemeOptionsComponent} from "./components/app-settings/theme-options.component";
import {SerializerService} from "./services/serializer.service";
import {SplitterModule} from "primeng/splitter";
import {LeftPanelComponent} from "./components/left-panel/left-panel.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, PropertiesComponent, AsyncPipe, ButtonModule, StructureTreeComponent, CanvasComponent, HeaderComponent, ThemeOptionsComponent, SplitterModule, LeftPanelComponent],
  providers: [CanvasStore, DataService, SerializerService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'layout';
  frame: Frame | undefined;

  constructor(protected canvasStore: CanvasStore,
              private mockService: DataService) {
    this.fetchData();

    this.canvasStore.setSelectedFrameKey(this.canvasStore.frames[0]?.key)
  }

  fetchData() {
    this.canvasStore.frames = this.mockService.getInitialData();
  }
}
