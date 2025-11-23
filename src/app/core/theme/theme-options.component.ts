import {Component, inject} from '@angular/core';
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {ThemeService} from "../services/theme.service";
import {Drawer} from "primeng/drawer";
import {ToggleSwitchChangeEvent, ToggleSwitch} from "primeng/toggleswitch";
import {Button} from "primeng/button";
import {RadioButton} from "primeng/radiobutton";
import {ListboxChangeEvent, Listbox} from "primeng/listbox";

@Component({
    selector: 'app-theme-options',
    imports: [CommonModule, FormsModule, Drawer, ToggleSwitch, Button, RadioButton, Listbox],
    templateUrl: './theme-options.component.html',
    styleUrl: './theme-options.component.scss'
})
export class ThemeOptionsComponent {
  private themeService = inject(ThemeService);

  themes = [
    {name: 'aura blue', value: 'aura-blue'},
    {name: 'lara blue', value: 'lara-blue'},
    {name: 'material', value: 'md-deeppurple'},
    {name: 'material condensed', value: 'mdc-deeppurple'},
    {name: 'mira', value: 'mira'}
  ]

  selectedTheme: { name: string, value: string } | undefined = undefined;

  constructor() {
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

  onRippleChange(event: ToggleSwitchChangeEvent) {
    this.ripple = event.checked;
  }

  onDarkModeChange(event: ToggleSwitchChangeEvent) {
    this.darkMode = event.checked;
  }

  onSelectedThemeChange($event: ListboxChangeEvent) {
    this.themeService.config.update((config) => ({...config, theme: $event.value.value}));
  }
}
