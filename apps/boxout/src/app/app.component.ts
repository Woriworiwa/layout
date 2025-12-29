import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {
  CanvasService,
  SelectionService,
  provideCanvas,
} from '@layout/canvas';
import {
  UI_GUIDANCE_TOKEN,
  AI_GENERATION_TOKEN,
} from '@layout/shared';
import { DataService } from './core/services/data.service';
import { MessageService } from 'primeng/api';
import { AiGenerationService } from './core/services/ai-generation.service';
import { UiGuidanceService } from './core/services/ui-guidance.service';
import {
  provideSerialization,
} from '@layout/serialization';
import { providePresets } from '@layout/presets';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  providers: [
    ...provideCanvas(),
    ...providePresets(),
    ...provideSerialization(),
    DataService,
    MessageService,
    { provide: UI_GUIDANCE_TOKEN, useExisting: UiGuidanceService },
    { provide: AI_GENERATION_TOKEN, useExisting: AiGenerationService },
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  protected canvasService = inject(CanvasService);
  private selectionService = inject(SelectionService);
  private mockService = inject(DataService);

  constructor() {
    this.fetchData();

    this.selectionService.setSelectedItemKey(this.canvasService.items[0]?.key);
  }

  fetchData() {
    this.canvasService.setItems(this.mockService.getInitialData());
  }
}
