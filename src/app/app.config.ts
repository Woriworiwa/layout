import {ApplicationConfig, importProvidersFrom} from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {providePrimeNG} from "primeng/config";
// import Aura from '@primeng/themes/lara';
// import Aura from '@primeng/themes/aura';
import Aura from '@primeng/themes/material'
// import Aura from '@primeng/themes/nora';
import {definePreset} from "@primeng/themes";

const theme = definePreset(Aura, {
  components: {
    panel: {
      colorScheme: {
        light: {
          root: {
            background: '{surface.0}',
            color: '{surface.700}'
          },
          subtitle: {
            color: '{surface.500}'
          }
        },
        dark: {
          root: {
            background: '{surface.700}',
            color: '{surface.0}'
          },
          subtitle: {
            color: '{surface.400}'
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
          },
          subtitle: {
            color: '{surface.500}'
          }
        },
        dark: {
          root: {
            background: '{surface.800}',
            color: '{surface.0}'
          },
          subtitle: {
            color: '{surface.400}'
          }
        }
      }
    }
  }
});

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    importProvidersFrom(BrowserAnimationsModule),
    providePrimeNG({
      theme: {
        preset: theme,
        options: {
          darkModeSelector: '.p-dark'
        }
      }
    })
  ]
};
