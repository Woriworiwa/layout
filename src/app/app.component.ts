import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {FrameComponent} from "./components/frame/frame.component";
import {PropertiesComponent} from "./components/properties/properties.component";
import {AsyncPipe} from "@angular/common";
import {ButtonModule} from "primeng/button";
import {TreeSelectorComponent} from "./components/tree-selector/tree-selector.component";
import {CanvasStore} from "./stores/canvas.store";
import {CanvasComponent} from "./components/canvas/canvas.component";
import {MockService} from "./services/mock.service";
import {Frame} from "./models/frame.model";
import {HeaderComponent} from "./components/header/header.component";
import {ThemeOptionsComponent} from "./components/header/theme-options.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FrameComponent, PropertiesComponent, AsyncPipe, ButtonModule, TreeSelectorComponent, CanvasComponent, HeaderComponent, ThemeOptionsComponent],
  providers: [CanvasStore, MockService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'layout';
  frame: Frame | undefined;

  constructor(protected canvasStore: CanvasStore,
              private mockService: MockService) {
    this.initializeMockData();
  }

  initializeMockData() {
    const mockData = this.mockService.generateMockData();
    this.canvasStore.setRootFrame(mockData);
  }
}
