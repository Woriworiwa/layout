import { Component, inject, model, OnInit, OnDestroy } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';

import {CanvasComponent} from "../canvas/canvas.component";
import {PropertiesComponent} from "./properties/properties.component";
import {AssetsComponent} from "./assets/assets.component";
import {InspectorComponent} from "./inspector/inspector.component";
import {LayersComponent} from "./layers/layers.component";
import {HeaderComponent} from "./header/header.component";
import { TabSwitcherComponent, TabOption } from '../shared/tab-switcher/tab-switcher.component';
import { AppStateService } from '../core/services/app-state.service';
import { SideBarPrimary } from '../core/enums';
import { UiGuidanceService } from '../core/services/ui-guidance.service';

@Component({
  selector: 'app-designer',
  imports: [
    HeaderComponent,
    CanvasComponent,
    PropertiesComponent,
    AssetsComponent,
    InspectorComponent,
    LayersComponent,
    TabSwitcherComponent,
  ],
  templateUrl: './designer.component.html',
  styleUrl: './designer.component.scss',
})
export class DesignerComponent implements OnInit, OnDestroy {
  protected appStateService = inject(AppStateService);
  private uiGuidanceService = inject(UiGuidanceService);
  private destroy$ = new Subject<void>();

  leftPanelMode = model<'assets' | 'layers'>('assets');

  leftPanelOptions: TabOption[] = [
    { label: 'Assets', value: 'assets', icon: 'pi pi-plus' },
    { label: 'Layers', value: 'layers', icon: 'pi pi-comment' },
  ];
  protected readonly SideBarPrimary = SideBarPrimary;

  ngOnInit(): void {
    // Listen for guidance events
    this.uiGuidanceService.guidanceEvent$
      .pipe(takeUntil(this.destroy$))
      .subscribe(event => {
        if (event.target === 'layers-panel' && event.action === 'highlight') {
          // Switch to layers panel if not already visible, then wait a bit before showing message
          if (this.leftPanelMode() !== 'layers') {
            this.leftPanelMode.set('layers');
            // Give Angular time to render the layers component before showing the message
            setTimeout(() => {
              // Re-emit the event so the now-visible layers component can handle it
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
