import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';

/**
 * Interface for UI guidance events
 */
export interface GuidanceEvent {
  target: string;
  action: string;
}

/**
 * Interface for UI guidance service that can be provided from the app level
 */
export interface UiGuidance {
  guidanceEvent$: Observable<GuidanceEvent>;
  highlightLayersPanel(): void;
}

/**
 * Injection token for UI guidance service
 * This allows the canvas library to request a UI guidance service
 * without directly depending on app-level services
 */
export const UI_GUIDANCE_TOKEN = new InjectionToken<UiGuidance>(
  'UI_GUIDANCE_TOKEN',
  {
    factory: () => {
      // Default implementation that does nothing
      return {
        guidanceEvent$: new Observable(),
        highlightLayersPanel: () => {
          /* empty */
        },
      };
    },
  },
);
