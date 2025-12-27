import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { providePrimeNG } from 'primeng/config';
import { provideHighlightOptions } from 'ngx-highlightjs';
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { defaultTheme } from './core/theme/theme.presets';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    importProvidersFrom(BrowserAnimationsModule),
    provideHttpClient(withInterceptorsFromDi()),
    provideHighlightOptions({
      fullLibraryLoader: () => import('highlight.js'),
      themePath: 'assets/styles/highlightjs.default.css',
    }),
    providePrimeNG({
      theme: {
        preset: defaultTheme,
        options: {
          darkModeSelector: '.dark',
        },
      },
    }),
  ],
};
