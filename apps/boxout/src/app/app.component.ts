import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {
  CanvasStore,
  CanvasService,
  UndoRedoService,
  SelectionService,
  ContextMenuService,
  UndoRedoDirective,
  PRESET_PROVIDER,
  UI_GUIDANCE_TOKEN,
  AI_GENERATION_TOKEN,
} from '@layout/canvas';
import { DataService } from './core/services/data.service';
import { MessageService } from 'primeng/api';
import { PresetService } from './designer/presets/preset.service';
import { AiGenerationService } from './core/services/ai-generation.service';
import { UiGuidanceService } from './core/services/ui-guidance.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  providers: [
    CanvasStore,
    CanvasService,
    DataService,
    MessageService,
    PresetService,
    { provide: PRESET_PROVIDER, useExisting: PresetService },
    { provide: UI_GUIDANCE_TOKEN, useExisting: UiGuidanceService },
    { provide: AI_GENERATION_TOKEN, useExisting: AiGenerationService },
    SelectionService,
    ContextMenuService,
    UndoRedoService,
  ],
  hostDirectives: [UndoRedoDirective],
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
