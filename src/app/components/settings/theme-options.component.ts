import {Component} from '@angular/core';
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {ThemeService} from "../../services/theme.service";
import {SidebarModule} from "primeng/sidebar";
import {InputSwitchChangeEvent, InputSwitchModule} from "primeng/inputswitch";
import {ButtonModule} from "primeng/button";
import {RadioButtonModule} from "primeng/radiobutton";
import {ListboxChangeEvent, ListboxModule} from "primeng/listbox";

@Component({
  selector: 'app-theme-options',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarModule, InputSwitchModule, ButtonModule, RadioButtonModule, ListboxModule],
  templateUrl: './theme-options.component.html',
  styleUrl: './theme-options.component.scss'
})
export class ThemeOptionsComponent {
  themes = [
    {name: 'aura blue', value: 'aura-blue'},
    {name: 'lara blue', value: 'lara-blue'},
    {name: 'material', value: 'md-deeppurple'},
    {name: 'material condensed', value: 'mdc-deeppurple'},
    {name: 'mira', value: 'mira'}
  ]

  selectedTheme: { name: string, value: string } | undefined = undefined;

  constructor(private themeService: ThemeService) {
    this.selectedTheme = this.themes.find((theme) => theme.value === this.themeService.config().theme);
  }

  get ripple(): boolean {
    return this.themeService.config().ripple;
  }

  set ripple(val: boolean) {
    this.themeService.config.update((config) => ({...config, ripple: val}));
  }

  get darkMode() {
    return this.themeService.config().darkMode;
  }

  set darkMode(val: boolean) {
    this.themeService.config.update((config) => ({...config, darkMode: val}));
  }

  onRippleChange(event: InputSwitchChangeEvent) {
    this.ripple = event.checked;
  }

  onDarkModeChange(event: InputSwitchChangeEvent) {
    this.darkMode = event.checked;
  }

  onSelectedThemeChange($event: ListboxChangeEvent) {
    this.themeService.config.update((config) => ({...config, theme: $event.value.value}));
  }
}
