import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { CanvasItem } from '../models/canvas-item.model';
import { environment } from '../../../environments/environment';

export interface AiGenerationResponse {
  items: CanvasItem[];
  rawResponse?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AiGenerationService {
  private http = inject(HttpClient);
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
      .post<any>(
        `${this.GEMINI_API_URL}?key=${environment.geminiApiKey}`,
        payload,
      )
      .pipe(
        map((response) => this.parseGeminiResponse(response)),
        catchError((error) => this.handleError(error)),
      );
  }

  private buildSystemPrompt(): string {
    return `You are a CSS layout generator. Generate valid JSON arrays of CanvasItem objects.

CanvasItem Schema:
{
  "itemType": "FLEX" | "TEXT",
  "label": "string (optional)",
  "content": "string (required for TEXT items only)",
  "children": CanvasItem[] (optional, for FLEX containers),
  "css": {
    "display": { "display": "flex" },
    "flexContainer": {
      "flexDirection": "row" | "column",
      "flexWrap": "wrap" | "nowrap",
      "gap": "numeric value only (auto-postfixed with 'px')",
      "justifyContent": "center" | "start" | "end" | "space-around" | "space-between" | "space-evenly",
      "alignItems": "start" | "end" | "center" | "stretch" | "baseline",
      "alignContent": "start" | "end" | "center" | "stretch" | "space-between" | "space-around" | "space-evenly" | "baseline"
    },
    "flexItem": {
      "flexGrow": number,
      "flexShrink": number,
      "flexBasis": string,
      "alignSelf": "start" | "end" | "center" | "baseline" | "stretch"
    },
    "boxSizing": {
      "padding": "string with unit (px, vh, %)",
      "width": "string with unit (px, vh, %)",
      "height": "string with unit (px, vh, %)"
    }
  }
}

CRITICAL LIMITATIONS - DO NOT USE:
- NO font-size, font-weight, color, font-family (no typography)
- NO borders, border-radius
- NO margins
- NO background-color, background
- NO position, top, left, right, bottom
- gap property: numeric values only (px auto-added)

Rules:
1. Return ONLY valid JSON array, no markdown formatting
2. FLEX items MUST have css.display.display = "flex"
3. TEXT items MUST have content property
4. Use semantic labels for items
5. Keep layouts simple and focused
6. Use only the CSS properties listed above
7. Do not specify width or height for items unless necessary. The canvas width is dynamic but assume 600px wide.

Example:
[{
  "itemType": "FLEX",
  "label": "Card",
  "css": {
    "display": { "display": "flex" },
    "flexContainer": { "flexDirection": "column", "gap": "12" },
    "boxSizing": { "padding": "20px", "width": "300px" }
  },
  "children": [
    {
      "itemType": "TEXT",
      "label": "Title",
      "content": "Card Title"
    }
  ]
}]`;
  }

  private parseGeminiResponse(response: any): AiGenerationResponse {
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

  private handleError(error: any): Observable<never> {
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
