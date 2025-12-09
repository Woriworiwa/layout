import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from './theme.service';
import { ToggleSwitch } from 'primeng/toggleswitch';
import { FormsModule } from '@angular/forms';
import { presets, primaryColors, surfaces } from './theme.presets';

@Component({
  selector: 'app-theme-configurator',
  imports: [CommonModule, ToggleSwitch, FormsModule],
  templateUrl: './theme-configurator.component.html',
  styleUrls: ['./theme-configurator.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThemeConfiguratorComponent {
  protected themeService = inject(ThemeService);

  onPrimaryChange(primary: string) {
    this.themeService.onPrimaryChange(primary);
  }

  onSurfaceChange(surface: string) {
    this.themeService.onSurfaceChange(surface);
  }

  onRippleToggle() {
    this.themeService.toggleRipple();
  }

  onDarkModeToggle() {
    this.themeService.config.update((config) => {
      return {
        ...config,
        darkMode: !config.darkMode,
      };
    });
  }

  protected readonly presets = presets;
  protected readonly surfaces = surfaces;
  protected readonly primaryColors = primaryColors;
}
