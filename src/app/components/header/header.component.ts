import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ThemeOptionsComponent} from "../settings/theme-options.component";
import {ThemeService} from "../../services/theme.service";
import {SerializerService} from '../../services/serializer.service';
import {JsonPrismComponent} from "../prisms/json-prism.component";
import {CdkDrag, CdkDropList} from "@angular/cdk/drag-drop";
import {ToggleButtonModule} from "primeng/togglebutton";
import {AppSettingsStore} from "../../store/app-settings-store.service";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, ThemeOptionsComponent, JsonPrismComponent, CdkDrag, CdkDropList, ToggleButtonModule, FormsModule],
  templateUrl: `./header.component.html`,
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  constructor(private themeService: ThemeService,
              private serializerService: SerializerService,
              private appSettingsStore: AppSettingsStore) {
  }

  showConfig() {
    this.themeService.showConfig();
  }
}
