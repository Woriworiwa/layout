import {Component, EventEmitter, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ThemeOptionsComponent} from "../settings/theme-options.component";
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

@Component({
    selector: 'app-header',
    imports: [CommonModule, ThemeOptionsComponent, ToggleButtonModule, FormsModule, SidebarModule, TooltipModule, SplitButtonModule, MessageModule, OverlayPanelModule],
    templateUrl: `./header.component.html`,
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  @Output()
  selectedContentChanged = new EventEmitter<number>();

  protected readonly window = window;

  selectedTabId = 1;

  items: MenuItem[] = [
    {
      label: 'Empty local storage',
      icon: 'pi pi-trash',
      command: () => {
        this.clearLocalStorage();
      }
    }
  ];

  tabs: { label: string, id: number}[] = [
    { label: 'Canvas', id: 1 },
    { label: 'Preview', id: 2 },
    { label: 'CSS', id: 3 },
    { label: 'HTML', id: 4 },
    { label: 'JSON', id: 5 }
  ];

  constructor(private themeService: ThemeService,
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

  setSelectedTab(id: number) {
    this.selectedContentChanged.emit(id);
    this.selectedTabId = id;
  }
}
