import { Component, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {UndoRedoService} from "../../../core/undo-redo/undo-redo.service";
import {ButtonModule} from "primeng/button";
import {PanZoomService} from "../pan-zoom.service";
import {TooltipModule} from "primeng/tooltip";
import {ThemeService} from "../../../core/services/theme.service";
import {AppStateService} from "../../../core/services/app-state.service";

@Component({
    selector: 'app-canvas-toolbar',
    imports: [CommonModule, ButtonModule, TooltipModule],
    host: {
        '[class.surface-0]': 'true',
    },
    templateUrl: './canvas-toolbar.component.html',
    styleUrl: './canvas-toolbar.component.scss'
})
export class CanvasToolbarComponent {
  protected undoRedoService = inject(UndoRedoService);
  protected panZoomService = inject(PanZoomService);
  protected themeService = inject(ThemeService);
  protected appStateService = inject(AppStateService);

  @HostListener('click', ['$event'])
  onClick($event: MouseEvent) {
    $event.stopPropagation();
  }
}
