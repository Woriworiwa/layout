import { Component, model } from '@angular/core';

import {CanvasComponent} from "../canvas/canvas.component";
import {PropertiesComponent} from "./properties/properties.component";
import {InsertComponent} from "./insert/insert.component";
import {InspectorComponent} from "./inspector/inspector.component";
import {LayersComponent} from "./layers/layers.component";
import {HeaderComponent} from "./header/header.component";
import {SelectButton} from "primeng/selectbutton";
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-designer',
  imports: [
    HeaderComponent,
    CanvasComponent,
    PropertiesComponent,
    InsertComponent,
    InspectorComponent,
    LayersComponent,
    SelectButton,
    FormsModule,
  ],
  templateUrl: './designer.component.html',
  styleUrl: './designer.component.scss',
})
export class DesignerComponent {
  leftPanelMode = model<'insert' | 'layers'>('insert');
  rightPanelMode = model<'properties' | 'inspector'>('properties');

  leftPanelOptions = [
    { label: 'Insert', value: 'insert', icon: 'pi pi-plus' },
    { label: 'Layers', value: 'layers', icon: 'pi pi-comment' },
  ];

  rightPanelOptions = [
    { label: 'Properties', value: 'properties', icon: 'pi pi-cog' },
    { label: 'Inspector', value: 'inspector', icon: 'pi pi-code' },
  ];
}
