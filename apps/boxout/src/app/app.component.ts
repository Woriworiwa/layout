import { Component, inject, model, OnDestroy, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {
  CanvasService,
  SelectionService,
  CanvasComponent,
} from '@layout/canvas';
import { DataService } from './core/services/data.service';
import { UiGuidanceService } from './core/services/ui-guidance.service';
import { HeaderComponent } from './header/header.component';
import { LayersComponent } from './layers-panel/layers.component';
import { PresetsPanelComponent } from './presets-panel/presets-panel.component';
import { PropertiesPanelComponent } from './properties-panel/properties-panel.component';
import { TabOption, TabSwitcherComponent } from './shared/tab-switcher/tab-switcher.component';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    CanvasComponent,
    HeaderComponent,
    LayersComponent,
    PresetsPanelComponent,
    PropertiesPanelComponent,
    TabSwitcherComponent,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  protected canvasService = inject(CanvasService);
  private selectionService = inject(SelectionService);
  private mockService = inject(DataService);

  private uiGuidanceService = inject(UiGuidanceService);
  private destroy$ = new Subject<void>();

  leftPanelMode = model<'assets' | 'layers-panel'>('assets');

  leftPanelOptions: TabOption[] = [
    { label: 'Assets', value: 'assets', icon: 'pi pi-plus' },
    { label: 'Layers', value: 'layers-panel', icon: 'pi pi-comment' },
  ];

  constructor() {
    this.fetchData();

    this.selectionService.setSelectedItemKey(this.canvasService.items[0]?.key);
  }

  ngOnInit(): void {
    // Listen for guidance events
    this.uiGuidanceService.guidanceEvent$
      .pipe(takeUntil(this.destroy$))
      .subscribe((event) => {
        if (
          event.target === 'layers-panel-panel' &&
          event.action === 'highlight'
        ) {
          // Switch to layers-panel panel if not already visible, then wait a bit before showing message
          if (this.leftPanelMode() !== 'layers-panel') {
            this.leftPanelMode.set('layers-panel');
            // Give Angular time to render the layers-panel component before showing the message
            setTimeout(() => {
              // Re-emit the event so the now-visible layers-panel component can handle it
              this.uiGuidanceService.highlightLayersPanel();
            }, 100);
          }
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  fetchData() {
    this.canvasService.setItems(this.mockService.getInitialData());
  }
}
