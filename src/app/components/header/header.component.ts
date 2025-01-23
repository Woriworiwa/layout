import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ThemeService} from "../../services/theme.service";
import {ToggleButtonModule} from "primeng/togglebutton";
import {FormsModule} from "@angular/forms";
import {DataService} from "../../services/data.service";
import {SidebarModule} from "primeng/sidebar";
import {TooltipModule} from "primeng/tooltip";
import {SplitButtonModule} from "primeng/splitbutton";
import {MenuItem, MessageService} from "primeng/api";
import {MessageModule} from "primeng/message";
import {OverlayPanelModule} from "primeng/overlaypanel";
import {CanvasService} from "../../services/canvas.service";
import {ButtonModule} from "primeng/button";
import {AppStateService} from "../../services/app-state.service";
import {MainAreaContent} from "../../models/enums";

@Component({
    selector: 'app-header',
  imports: [CommonModule, ButtonModule, ToggleButtonModule, FormsModule, SidebarModule, TooltipModule, SplitButtonModule, MessageModule, OverlayPanelModule],
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

  tabs: { label: string, id: MainAreaContent}[] = [
    { label: 'Canvas', id: MainAreaContent.CANVAS },
    { label: 'Preview', id: MainAreaContent.PREVIEW }
  ];

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

  setSelectedTab(mainAreaContet: MainAreaContent) {
    this.appStateService.setAppLayout({mainAreaContent: mainAreaContet})
    this.selectedTabId = mainAreaContet;
  }
}
