import { Injectable, signal, inject } from '@angular/core';
import { ThemeModel } from './theme.model';
import { updatePreset, updatePrimaryPalette, updateSurfacePalette, definePreset } from '@primeng/themes';
import { DOCUMENT } from '@angular/common';
import { HighlightLoader } from 'ngx-highlightjs';
import { defaultThemeSettings, primaryColors, surfaces } from './theme.presets';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  config = signal<ThemeModel>(defaultThemeSettings);
  themeConfiguratorActive = signal<boolean>(false);

  private document = inject(DOCUMENT);
  private hljsLoader: HighlightLoader = inject(HighlightLoader);
  private transitionComplete = signal<boolean>(false);

  showConfig() {
    this.themeConfiguratorActive.set(true);
  }

  hideConfig() {
    this.themeConfiguratorActive.set(false);
  }

  toggleDarkMode() {
    this.transitionView(() => {
      const newDarkMode = !this.config().darkMode;
      if (newDarkMode) {
        this.document.documentElement.classList.add('p-dark');
        this.hljsLoader.setTheme('https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/styles/base16/google-light.min.css');
      } else {
        this.document.documentElement.classList.remove('p-dark');
        this.hljsLoader.setTheme('https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/styles/base16/google-dark.min.css');
      }
      this.config.update(config => ({ ...config, darkMode: newDarkMode }));
    })
  }

  toggleRipple() {
    const newRipple = !this.config().ripple;
    this.config.update(config => ({ ...config, ripple: newRipple }));
  }

  async onPresetChange(preset: string) {
    this.transitionView(async () => {
      this.config.update(config => ({ ...config, preset }));

      const presetModule = await this.loadPreset(preset);

      // Apply customizations to the new preset
      const customizedPreset = definePreset(presetModule.default, {
        semantic: {
          transitionDuration: '0.2s'
        },
        components: {
          panel: {
            colorScheme: {
              light: {
                root: {
                  background: '{surface.0}',
                  color: '{surface.700}'
                }
              },
              dark: {
                root: {
                  background: '{surface.700}',
                  color: '{surface.0}'
                }
              }
            }
          },
          tree: {
            colorScheme: {
              light: {
                root: {
                  background: '{surface.0}',
                  color: '{surface.700}'
                }
              },
              dark: {
                root: {
                  background: '{surface.800}',
                  color: '{surface.0}'
                }
              }
            }
          }
        }
      });

      // Update the preset with our customizations
      updatePreset(customizedPreset);
      this.onPrimaryChange(this.config().primary);
      this.onSurfaceChange(this.config().surface)
    })
  }

  onPrimaryChange(primary: string) {
    this.config.update(config => ({ ...config, primary }));
    const primaryColor = primaryColors.find(c => c.name === primary);
    if (primaryColor) {
      updatePrimaryPalette(primaryColor.palette);
    }
  }

  onSurfaceChange(surface?: string) {
    if (!surface) {
      return;
    }

    this.config.update(config => ({ ...config, surface }));
    const surfaceColor = surfaces.find(c => c.name === surface);
    if (surfaceColor) {
      updateSurfacePalette(surfaceColor.palette);
    }
  }

  private async loadPreset(preset: string) {
    switch (preset) {
      case 'aura':
        return await import('@primeng/themes/aura');
      case 'lara':
        return await import('@primeng/themes/lara');
      case 'nora':
        return await import('@primeng/themes/nora');
      case 'material':
      default:
        return await import('@primeng/themes/material');
    }
  }

  private transitionView(callback: () => void): void {
    const transition = document.startViewTransition(() => {
      callback();
    });

    transition.ready.then(() => {
      this.transitionComplete.set(true);
      setTimeout(() => {
        this.transitionComplete.set(false);
      });
    });
  }
}
