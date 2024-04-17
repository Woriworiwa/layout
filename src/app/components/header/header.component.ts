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

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, ThemeOptionsComponent, JsonPrismComponent, CdkDrag, CdkDropList, ToggleButtonModule, FormsModule, SidebarModule, PreviewComponent],
  templateUrl: `./header.component.html`,
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  previewVisible: boolean = false;

  constructor(private themeService: ThemeService,
              protected appSettingsStore: AppSettingsStore,
              private dataService: DataService) {
  }

  showConfig() {
    this.themeService.showConfig();
  }

  save() {
    this.dataService.saveDataToLocalStorage();
  }

  showPreview() {
    this.appSettingsStore.previewActive = true;
  }
}
