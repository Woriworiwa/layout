import { Component, inject } from '@angular/core';

import {AppSkeletonComponent} from "../core/app.skeleton.component";
import {CanvasComponent} from "../canvas/canvas.component";
import {PropertiesComponent} from "./properties/properties.component";
import {SideBarPrimary} from "../core/enums";
import {InsertComponent} from "./insert/insert.component";
import {InspectorComponent} from "./inspector/inspector.component";
import {LayersComponent} from "./layers/layers.component";
import {AppStateService} from "../core/services/app-state.service";

@Component({
  selector: 'app-designer',
  imports: [AppSkeletonComponent, CanvasComponent, PropertiesComponent, InsertComponent, InspectorComponent, LayersComponent],
  templateUrl: './designer.component.html',
  styleUrl: './designer.component.scss',
})
export class DesignerComponent {
  protected appStateService = inject(AppStateService);

  leftPanelMode: 'insert' | 'layers' = 'insert';
  rightPanelMode: 'properties' | 'inspector' = 'properties';

  protected readonly SideBarPrimary = SideBarPrimary;
}
