import { Component, inject, model, OnInit, OnDestroy } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { CanvasComponent } from '@layout/canvas';
import { PropertiesPanelComponent } from './properties-panel/properties-panel.component';
import { PresetsPanelComponent } from './presets-panel/presets-panel.component';
import { LayersComponent } from './layers-panel/layers.component';
import { HeaderComponent } from './header/header.component';
import {
  TabSwitcherComponent,
  TabOption,
} from '../shared/tab-switcher/tab-switcher.component';
import { UiGuidanceService } from '../core/services/ui-guidance.service';

@Component({
  selector: 'app-designer',
  imports: [
    HeaderComponent,
    CanvasComponent,
    PropertiesPanelComponent,
    PresetsPanelComponent,
    LayersComponent,
    TabSwitcherComponent,
  ],
  templateUrl: './designer.component.html',
  styleUrl: './designer.component.scss',
})
export class DesignerComponent implements OnInit, OnDestroy {
  private uiGuidanceService = inject(UiGuidanceService);
  private destroy$ = new Subject<void>();

  leftPanelMode = model<'assets' | 'layers-panel'>('assets');

  leftPanelOptions: TabOption[] = [
    { label: 'Assets', value: 'assets', icon: 'pi pi-plus' },
    { label: 'Layers', value: 'layers-panel', icon: 'pi pi-comment' },
  ];

  ngOnInit(): void {
    // Listen for guidance events
    this.uiGuidanceService.guidanceEvent$
      .pipe(takeUntil(this.destroy$))
      .subscribe((event) => {
        if (event.target === 'layers-panel-panel' && event.action === 'highlight') {
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
}
