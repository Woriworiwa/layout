import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { CanvasItem } from '../canvas-item.model';

/**
 * Interface for AI generation response
 */
export interface AiGenerationResponse {
  items: CanvasItem[];
  rawResponse?: string;
}

/**
 * Interface for AI generation service that can be provided from the app level
 */
export interface AiGeneration {
  generateLayout(prompt: string): Observable<AiGenerationResponse>;
}

/**
 * Injection token for AI generation service
 * This allows the canvas library to request an AI generation service
 * without directly depending on app-level services
 */
export const AI_GENERATION_TOKEN = new InjectionToken<AiGeneration>(
  'AI_GENERATION_TOKEN',
  {
    providedIn: 'root',
    factory: () => {
      // Default implementation that does nothing
      return {
        generateLayout: () => {
          throw new Error('AI generation service not provided');
        },
      };
    },
  },
);
