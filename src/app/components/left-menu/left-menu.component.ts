import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {StructureTreeComponent} from "../structure-tree/structure-tree.component";
import {ButtonModule} from "primeng/button";
import {TooltipModule} from "primeng/tooltip";
import {SelectButtonModule} from "primeng/selectbutton";
import {FormsModule} from "@angular/forms";
import {InsertComponent} from "../insert/insert.component";
import {CANVAS_WRAPPER_ID} from "../../models/constants";

@Component({
  selector: 'app-left-menu',
  standalone: true,
  imports: [CommonModule, StructureTreeComponent, ButtonModule, TooltipModule, SelectButtonModule, FormsModule, InsertComponent],
  templateUrl: './left-menu.component.html',
  styleUrl: './left-menu.component.scss'
})
export class LeftMenuComponent {
  selectedTab: LeftMenuTabs = LeftMenuTabs.insert;
  tabs: {label: string, tab: LeftMenuTabs}[] = [
    { label: 'Insert', tab: LeftMenuTabs.insert },
    { label: 'Layers', tab: LeftMenuTabs.elements }
  ];

  protected readonly LeftMenuTabs = LeftMenuTabs;
  protected readonly CANVAS_WRAPPER_ID = CANVAS_WRAPPER_ID;
}

enum LeftMenuTabs {
  insert = 'insert',
  elements = 'elements'
}
