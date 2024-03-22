import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {NbLayoutModule, NbSidebarModule} from "@nebular/theme";
import {FrameComponent} from "./canvas/frame/frame.component";
import {PropertiesComponent} from "./properties/properties.component";
import {AsyncPipe} from "@angular/common";
import {ButtonModule} from "primeng/button";
import {TreeSelectorComponent} from "./tree-selector/tree-selector.component";
import {CanvasStore} from "./core/stores/canvas.store";
import {CanvasComponent} from "./canvas/canvas.component";
import {MockService} from "./core/services/mock.service";
import {Frame} from "./core/models/frame.model";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NbLayoutModule, NbSidebarModule, FrameComponent, PropertiesComponent, AsyncPipe, ButtonModule, TreeSelectorComponent, CanvasComponent],
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
