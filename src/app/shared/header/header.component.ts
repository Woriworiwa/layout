import {Component} from '@angular/core';

import {ThemeService} from "../../core/services/theme.service";
import {ToggleButtonModule} from "primeng/togglebutton";
import {FormsModule} from "@angular/forms";
import {DataService} from "../../core/services/data.service";
import {SidebarModule} from "primeng/sidebar";
import {TooltipModule} from "primeng/tooltip";
import {SplitButtonModule} from "primeng/splitbutton";
import {MenuItem, MessageService} from "primeng/api";
import {MessageModule} from "primeng/message";
import {OverlayPanelModule} from "primeng/overlaypanel";
import {CanvasService} from "../canvas/canvas.service";
import {ButtonModule} from "primeng/button";
import {AppStateService} from "../../core/services/app-state.service";
import {MainAreaContent} from "../../core/enums";
import {RouterLink, RouterLinkActive} from "@angular/router";
import {Menubar} from "primeng/menubar";

@Component({
    selector: 'app-header',
  imports: [ButtonModule, ToggleButtonModule, FormsModule, SidebarModule, TooltipModule, SplitButtonModule, MessageModule, OverlayPanelModule, RouterLink, RouterLinkActive, Menubar],
    templateUrl: `./header.component.html`,
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  protected readonly window = window;

  selectedTabId = MainAreaContent.CANVAS;

  items: MenuItem[] = [
    {
      label: 'Empty local storage',
      icon: 'pi pi-trash',
      command: () => {
        this.clearLocalStorage();
      }
    }
  ];

  tabs: {
    routerLink: string;
    label: string, id: MainAreaContent}[] = [
    { label: 'design', id: MainAreaContent.CANVAS, routerLink: '/design' },
    { label: 'preview', id: MainAreaContent.PREVIEW, routerLink: '/preview' },
    { label: 'learn', id: MainAreaContent.TUTORIAL, routerLink: '/learn' },
  ];

  scopedTokens = {
    borderColor: 'transparent'
  }

  constructor(private themeService: ThemeService,
              protected appStateService: AppStateService,
              private dataService: DataService,
              private canvasService: CanvasService,
              private messageService: MessageService) {
  }

  showConfig() {
    this.themeService.showConfig();
  }

  save() {
    this.dataService.saveDataToLocalStorage();
    this.messageService.add({ severity: 'info', summary: 'Info', detail: 'Saved to local storage.' });
  }

  clearLocalStorage() {
    this.dataService.clearLocalStorage();
    this.canvasService.setItems(this.dataService.getInitialData());
    this.messageService.add({ severity: 'info', summary: 'Info', detail: 'Local storage cleared.' });
  }

  setSelectedTab(mainAreaContent: MainAreaContent) {
    this.appStateService.setAppLayout({mainAreaContent: mainAreaContent})
    this.selectedTabId = mainAreaContent;
  }
}
