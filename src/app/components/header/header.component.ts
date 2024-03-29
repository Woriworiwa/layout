import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ThemeOptionsComponent} from "../app-settings/theme-options.component";
import {ThemeService} from "../../services/theme.service";
import {SerializerService} from '../../services/serializer.service';
import {SerializerComponent} from "../serializer/serializer.component";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, ThemeOptionsComponent, SerializerComponent],
  template: `
    Framer Ripoff
    <div class="action-buttons-container">
      <button type="button"
              class="action-button p-button   w-2rem h-2rem  transition-all transition-duration-300 min-w-0"
              (click)="showConfig()">
        <i class="pi pi-palette"></i>
      </button>

      <button type="button"
              class="action-button p-button   w-2rem h-2rem  transition-all transition-duration-300 min-w-0"
              (click)="showSerializer()">
        <i class="pi pi-palette"></i>
      </button>
    </div>

    <app-theme-options></app-theme-options>
    <app-serializer></app-serializer>
  `,
  styles: `
    :host {
      display: flex;
      padding: 20px;
      height: 60px;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid var(--surface-border, #eeeeee);

      .action-buttons-container {
        margin-left: auto;

        .action-button {
          margin-right: 20px;
          align-items: center;
          justify-content: center;
        }
      }

    }
  `
})
export class HeaderComponent {
  constructor(private themeService: ThemeService,
              private serializerService: SerializerService) {
  }

  showConfig() {
    this.themeService.showConfig();
  }

  showSerializer() {
    this.serializerService.showSerializer();
  }
}
