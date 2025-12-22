import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { CanvasItem } from '@layout/models';
import { environment } from '../../../environments/environment';
import { AiSchemaGeneratorService } from './ai-schema-generator.service';

export interface AiGenerationResponse {
  items: CanvasItem[];
  rawResponse?: string;
}

interface GeminiResponsePart {
  text: string;
}

interface GeminiContent {
  parts: GeminiResponsePart[];
}

interface GeminiCandidate {
  content: GeminiContent;
}

interface GeminiApiResponse {
  candidates: GeminiCandidate[];
}

@Injectable({
  providedIn: 'root',
})
export class AiGenerationService {
  private http = inject(HttpClient);
  private schemaGenerator = inject(AiSchemaGeneratorService);
  private readonly GEMINI_API_URL =
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

  generateLayout(prompt: string): Observable<AiGenerationResponse> {
    const systemPrompt = this.buildSystemPrompt();
    const fullPrompt = `${systemPrompt}\n\nUser request: ${prompt}`;

    const payload = {
      contents: [
        {
          parts: [
            {
              text: fullPrompt,
            },
          ],
        },
      ],
    };

    return this.http
      .post<GeminiApiResponse>(
        `${this.GEMINI_API_URL}?key=${environment.geminiApiKey}`,
        payload,
      )
      .pipe(
        map((response) => this.parseGeminiResponse(response)),
        catchError((error) => this.handleError(error)),
      );
  }

  private buildSystemPrompt(): string {
    const schema = this.schemaGenerator.generateCanvasItemSchema();

    return `You are a CSS layout generator. Generate valid JSON arrays of CanvasItem objects.

${schema}

IMPORTANT NOTES:
- All CSS properties are optional
- FLEX items use: display.display="flex", container (shared props), flexContainer (flex-specific props), flexItem
- GRID items use: display.display="grid", container (shared props), gridContainer (grid-specific props), gridItem
- TEXT items only need content property
- gap property: numeric values only (px auto-added)

CRITICAL LIMITATIONS - DO NOT USE:
- NO font-size, font-weight, color, font-family (no typography)
- NO borders, border-radius
- NO margins
- NO background-color, background
- NO position, top, left, right, bottom

Rules:
1. Return ONLY valid JSON array, no markdown formatting
2. FLEX items MUST have css.display.display = "flex"
3. GRID items MUST have css.display.display = "grid"
4. TEXT items MUST have content property
5. Use semantic labels for items
6. Keep layouts simple and focused
7. Use only the CSS properties listed in the schema
8. Do not specify width or height unless necessary. Canvas width is dynamic but assume 600px wide.

FLEX Example:
[{
  "itemType": "FLEX",
  "label": "Card",
  "css": {
    "display": { "display": "flex" },
    "container": { "gap": "12" },
    "flexContainer": { "flexDirection": "column" },
    "boxSizing": { "padding": "20px", "width": "300px" }
  },
  "children": [
    {
      "itemType": "TEXT",
      "label": "Title",
      "content": "Card Title"
    }
  ]
}]

GRID Example:
[{
  "itemType": "GRID",
  "label": "Grid Layout",
  "css": {
    "display": { "display": "grid" },
    "container": { "gap": "16" },
    "gridContainer": { "gridTemplateColumns": "repeat(3, 1fr)" }
  },
  "children": [
    {
      "itemType": "TEXT",
      "label": "Item 1",
      "content": "Grid Item 1"
    }
  ]
}]`;
  }

  private parseGeminiResponse(response: GeminiApiResponse): AiGenerationResponse {
    try {
      const text = response.candidates[0].content.parts[0].text;

      // Remove markdown code blocks if present
      let jsonText = text.trim();
      if (jsonText.startsWith('```json')) {
        jsonText = jsonText.replace(/```json\s*/g, '').replace(/```\s*$/g, '');
      } else if (jsonText.startsWith('```')) {
        jsonText = jsonText.replace(/```\s*/g, '').replace(/```\s*$/g, '');
      }

      const items = JSON.parse(jsonText);

      // Validate it's an array
      if (!Array.isArray(items)) {
        throw new Error('Response is not an array');
      }

      return {
        items,
        rawResponse: text,
      };
    } catch (error) {
      throw new Error(`Failed to parse AI response: ${error}`);
    }
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'AI generation failed';

    if (error.status === 401) {
      errorMessage = 'Invalid API key. Please check configuration.';
    } else if (error.status === 429) {
      errorMessage = 'Rate limit exceeded. Please try again later.';
    } else if (error.status === 400) {
      errorMessage = 'Invalid request. Please try a different description.';
    } else if (error.error?.error?.message) {
      errorMessage = error.error.error.message;
    } else if (!navigator.onLine) {
      errorMessage = 'Connection failed. Check your internet connection.';
    }

    return throwError(() => new Error(errorMessage));
  }
}
