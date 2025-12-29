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
import { provideCanvas } from '@layout/canvas';
import { providePresets } from '@layout/presets';
import { provideSerialization } from '@layout/serialization';
import { DataService } from './core/services/data.service';
import { MessageService } from 'primeng/api';
import { AI_GENERATION_TOKEN, UI_GUIDANCE_TOKEN } from '@layout/shared';
import { UiGuidanceService } from './core/services/ui-guidance.service';
import { AiGenerationService } from './core/services/ai-generation.service';

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
    ...provideCanvas(),
    ...providePresets(),
    ...provideSerialization(),
    DataService,
    MessageService,
    { provide: UI_GUIDANCE_TOKEN, useExisting: UiGuidanceService },
    { provide: AI_GENERATION_TOKEN, useExisting: AiGenerationService },
  ],
};
