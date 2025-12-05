import { Component, model } from '@angular/core';

import {CanvasComponent} from "../canvas/canvas.component";
import {PropertiesComponent} from "./properties/properties.component";
import {AssetsComponent} from "./assets/assets.component";
import {InspectorComponent} from "./inspector/inspector.component";
import {LayersComponent} from "./layers/layers.component";
import {HeaderComponent} from "./header/header.component";
import { TabSwitcherComponent, TabOption } from '../shared/tab-switcher/tab-switcher.component';

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
  leftPanelMode = model<'assets' | 'layers'>('assets');
  rightPanelMode = model<'properties' | 'inspector'>('properties');

  leftPanelOptions: TabOption[] = [
    { label: 'Assets', value: 'assets', icon: 'pi pi-plus' },
    { label: 'Layers', value: 'layers', icon: 'pi pi-comment' },
  ];

  rightPanelOptions: TabOption[] = [
    { label: 'Properties', value: 'properties', icon: 'pi pi-cog' },
    { label: 'Inspector', value: 'inspector', icon: 'pi pi-code' },
  ];
}
