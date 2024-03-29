import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ThemeOptionsComponent} from "./theme-options.component";
import {ThemeService} from "../../services/theme.service";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, ThemeOptionsComponent],
  template: `
    Framer Ripoff
    <button type="button"
            class="theme-button p-button   w-2rem h-2rem  transition-all transition-duration-300 min-w-0"
            (click)="showConfig()">
    <i class="pi pi-palette"></i>
  </button>
  <app-theme-options></app-theme-options>`,
  styles: `
    :host {
      display: flex;
      padding: 20px;
      height: 60px;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid var(--surface-border, #eeeeee);

      .theme-button {
        margin-right: 20px;
        margin-left: auto;
        align-items: center;
        justify-content: center;
      }
    }
  `
})
export class HeaderComponent {
  constructor(private themeService: ThemeService) {
  }
  showConfig() {
    this.themeService.showConfig();
  }
}
