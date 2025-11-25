import { Component, inject } from '@angular/core';

import {AppSkeletonComponent} from "../core/app.skeleton.component";
import {CanvasComponent} from "../canvas/canvas.component";
import {PropertiesComponent} from "./properties/properties.component";
import {SideBarComponent} from "./side-bar/side-bar.component";
import {SideBarPrimary} from "../core/enums";
import {InsertComponent} from "./insert/insert.component";
import {InspectorComponent} from "./inspector/inspector.component";
import {LayersComponent} from "./layers/layers.component";
import {AppStateService} from "../core/services/app-state.service";

@Component({
  selector: 'app-designer',
  imports: [AppSkeletonComponent, CanvasComponent, PropertiesComponent, SideBarComponent, InsertComponent, InspectorComponent, LayersComponent],
  templateUrl: './designer.component.html',
  styleUrl: './designer.component.scss',
})
export class DesignerComponent {
  protected appStateService = inject(AppStateService);

  selectedSideBarPrimary: SideBarPrimary = SideBarPrimary.insert;
  rightPanelMode: 'properties' | 'inspector' = 'properties';

  tabs: {title: string, tab: SideBarPrimary, icon: string}[] = [
    { title: 'Insert', tab: SideBarPrimary.insert, icon: 'pi pi-plus' },
    { title: 'Layers', tab: SideBarPrimary.elements, icon: 'pi pi-comment' },
    { title: 'Inspect', tab: SideBarPrimary.inspect, icon: 'pi pi-code' }
  ];

  onSideBarPrimaryChange($event: any) {
    this.selectedSideBarPrimary = $event.tab as unknown as SideBarPrimary;
  }

  protected readonly SideBarPrimary = SideBarPrimary;
}
