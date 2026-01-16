import { Component, inject, ChangeDetectionStrategy, computed } from '@angular/core';
import { ThemeService } from './theme.service';
import { ToggleSwitch } from 'primeng/toggleswitch';
import { FormsModule } from '@angular/forms';
import { primaryColors, surfaces } from './theme.presets';
import { Tooltip } from 'primeng/tooltip';
import { Popover } from 'primeng/popover';

@Component({
  selector: 'app-theme-toolbar',
  imports: [ToggleSwitch, FormsModule, Tooltip, Popover],
  templateUrl: './theme-toolbar.component.html',
  styleUrls: ['./theme-toolbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThemeToolbarComponent {
  protected themeService = inject(ThemeService);

  protected readonly primaryColors = primaryColors;
  protected readonly surfaces = surfaces;

  // Computed values for current selections
  protected currentPrimaryColor = computed(() => {
    const currentName = this.themeService.config().primary;
    return this.primaryColors.find(c => c.name === currentName);
  });

  protected currentSurface = computed(() => {
    const currentName = this.themeService.config().surface;
    return this.surfaces.find(s => s.name === currentName);
  });

  // Helper methods for background colors with proper null handling
  protected getPrimaryColorBg = computed(() => {
    const color = this.currentPrimaryColor();
    if (!color) return '#000000';
    return color.name === 'noir' ? '#000000' : (color.palette[500] || '#000000');
  });

  protected getSurfaceColorBg = computed(() => {
    const surface = this.currentSurface();
    return surface?.palette[500] || '#6b7280';
  });

  onPrimaryChange(primary: string) {
    this.themeService.onPrimaryChange(primary);
  }

  onSurfaceChange(surface: string) {
    this.themeService.onSurfaceChange(surface);
  }

  onDarkModeToggle() {
    this.themeService.config.update((config) => {
      return {
        ...config,
        darkMode: !config.darkMode,
      };
    });
  }
}
