import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {
  CanvasService,
  SelectionService,
  CanvasComponent,
} from '@layout/canvas';
import { DataService } from './core/services/data.service';
import { LayoutStateService } from './core/services/layout-state.service';
import { HeaderComponent } from './header/header.component';
import { InspectorComponent } from './inspector/inspector.component';
import { LayersComponent } from './layers-panel/layers.component';
import { PresetsPanelComponent } from './presets-panel/presets-panel.component';
import { PropertiesPanelComponent } from './properties-panel/properties-panel.component';
import { TabSwitcherComponent } from './shared/tab-switcher/tab-switcher.component';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    CanvasComponent,
    HeaderComponent,
    InspectorComponent,
    LayersComponent,
    PresetsPanelComponent,
    PropertiesPanelComponent,
    TabSwitcherComponent,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  protected canvasService = inject(CanvasService);
  protected layoutStateService = inject(LayoutStateService);
  private canvasSelectionService = inject(SelectionService);
  private mockService = inject(DataService);

  constructor() {
    this.fetchData();
    this.canvasSelectionService.setSelectedItemKey(this.canvasService.items[0]?.key);
  }

  fetchData() {
    this.canvasService.setItems(this.mockService.getInitialData());
  }
}
