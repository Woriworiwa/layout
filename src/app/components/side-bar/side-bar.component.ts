import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule} from "@angular/forms";
import {Tooltip} from "primeng/tooltip";
import {InsertComponent} from "../insert/insert.component";
import {StructureTreeComponent} from "../structure-tree/structure-tree.component";
import {Button} from "primeng/button";

@Component({
  selector: 'app-side-bar',
  imports: [CommonModule, FormsModule, Tooltip, InsertComponent, StructureTreeComponent, Button],
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.scss',
})
export class SideBarComponent {
  sampleAppsSidebarNavs = [
    { icon: 'pi pi-home', title: 'Overview' },
    { icon: 'pi pi-comment', title: 'Chat' },
    { icon: 'pi pi-inbox', title: 'Inbox' },
    { icon: 'pi pi-th-large', title: 'Cards' },
    { icon: 'pi pi-user', title: 'Customers' },
    { icon: 'pi pi-video', title: 'Movies' }
  ];

  setSelectedSampleAppsSidebarNav(nav: any) {
    this.selectedTab = nav.tab;
  }

  selectedTab: LeftMenuTabs = LeftMenuTabs.insert;

  tabs: {title: string, tab: LeftMenuTabs, icon: string}[] = [
    { title: 'Insert', tab: LeftMenuTabs.insert, icon: 'pi pi-plus' },
    { title: 'Layers', tab: LeftMenuTabs.elements, icon: 'pi pi-comment' },
    { title: 'Code', tab: LeftMenuTabs.code, icon: 'pi pi-code' }
  ];

  protected readonly LeftMenuTabs = LeftMenuTabs;
}

enum LeftMenuTabs {
  insert = 'insert',
  elements = 'elements',
  code = 'code'
}
