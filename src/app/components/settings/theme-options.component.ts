import {Component, Inject, Renderer2} from '@angular/core';
import {CommonModule, DOCUMENT} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {ThemeService} from "../../services/theme.service";
import {SidebarModule} from "primeng/sidebar";
import {InputSwitchChangeEvent, InputSwitchModule} from "primeng/inputswitch";
import {ButtonModule} from "primeng/button";
import {RadioButtonModule} from "primeng/radiobutton";
import {SelectButtonChangeEvent, SelectButtonModule} from "primeng/selectbutton";
import {ListboxChangeEvent, ListboxModule} from "primeng/listbox";

@Component({
  selector: 'app-theme-options',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarModule, InputSwitchModule, ButtonModule, RadioButtonModule, SelectButtonModule, ListboxModule],
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

  inputStyles = [
    {label: 'Outlined', value: 'outlined'},
    {label: 'Filled', value: 'filled'}
  ];

  scales: number[] = [12, 13, 14, 15, 16];

  selectedTheme: { name: string, value: string } | undefined = undefined;

  constructor(@Inject(DOCUMENT) private document: Document,
              private renderer: Renderer2,
              private themeService: ThemeService) {
    this.selectedTheme = this.themes.find((theme) => theme.value === this.themeService.config().theme);
  }

  get isActive(): boolean {
    return this.themeService.themeSwitcherActive;
  }

  get inputStyle(): string {
    return this.themeService.config().inputStyle;
  }

  set inputStyle(val: string) {
    this.themeService.config.update((config) => ({...config, inputStyle: val}));
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

  get scale(): number {
    return this.themeService.config().scale;
  }

  set scale(val: number) {
    this.themeService.config.update((config) => ({...config, scale: val}));
  }

  onVisibleChange(value: boolean) {
    if (!value) {
      this.themeService.hideConfig();
    }
  }

  decrementScale() {
    this.scale--;
  }

  incrementScale() {
    this.scale++;
  }

  onRippleChange(event: InputSwitchChangeEvent) {
    this.ripple = event.checked;
  }

  onDarkModeChange(event: InputSwitchChangeEvent) {
    this.darkMode = event.checked;
  }

  onInputStyleChange(event: SelectButtonChangeEvent) {
    this.inputStyle = event.value;
  }

  onSelectedThemeChange($event: ListboxChangeEvent) {
    this.themeService.config.update((config) => ({...config, theme: $event.value.value}));
  }
}
