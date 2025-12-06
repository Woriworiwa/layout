import { Component, inject, model } from '@angular/core';

import {CanvasComponent} from "../canvas/canvas.component";
import {PropertiesComponent} from "./properties/properties.component";
import {AssetsComponent} from "./assets/assets.component";
import {InspectorComponent} from "./inspector/inspector.component";
import {LayersComponent} from "./layers/layers.component";
import {HeaderComponent} from "./header/header.component";
import { TabSwitcherComponent, TabOption } from '../shared/tab-switcher/tab-switcher.component';
import { AppStateService } from '../core/services/app-state.service';
import { SideBarPrimary } from '../core/enums';

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
export class DesignerComponent {
  protected appStateService = inject(AppStateService);

  leftPanelMode = model<'assets' | 'layers'>('assets');

  leftPanelOptions: TabOption[] = [
    { label: 'Assets', value: 'assets', icon: 'pi pi-plus' },
    { label: 'Layers', value: 'layers', icon: 'pi pi-comment' },
  ];
  protected readonly SideBarPrimary = SideBarPrimary;
}
