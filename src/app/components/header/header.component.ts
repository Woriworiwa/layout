import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ThemeOptionsComponent} from "../settings/theme-options.component";
import {ThemeService} from "../../services/theme.service";
import {JsonPrismComponent} from "../prisms/json-prism.component";
import {CdkDrag, CdkDropList} from "@angular/cdk/drag-drop";
import {ToggleButtonModule} from "primeng/togglebutton";
import {AppSettingsStore} from "../../store/app-settings-store.service";
import {FormsModule} from "@angular/forms";
import {DataService} from "../../services/data.service";
import {SidebarModule} from "primeng/sidebar";
import {PreviewComponent} from "../preview/preview.component";
import {TooltipModule} from "primeng/tooltip";
import {SplitButtonModule} from "primeng/splitbutton";
import {MenuItem, MessageService} from "primeng/api";
import {MessageModule} from "primeng/message";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, ThemeOptionsComponent, JsonPrismComponent, CdkDrag, CdkDropList, ToggleButtonModule, FormsModule, SidebarModule, PreviewComponent, TooltipModule, SplitButtonModule, MessageModule],
  templateUrl: `./header.component.html`,
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  items: MenuItem[] = [
    {
      label: 'Empty local storage',
      icon: 'pi pi-trash',
      command: () => {
        this.clearLocalStorage();
      }
    }
  ];


  constructor(private themeService: ThemeService,
              protected appSettingsStore: AppSettingsStore,
              private dataService: DataService,
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
    this.messageService.add({ severity: 'info', summary: 'Info', detail: 'Local storage cleared.' });
  }
}
