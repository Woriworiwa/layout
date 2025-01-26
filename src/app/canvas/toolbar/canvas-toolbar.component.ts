import {Component, HostListener} from '@angular/core';
import { CommonModule } from '@angular/common';
import {UndoRedoService} from "../../core/undo-redo/undo-redo.service";
import {ButtonModule} from "primeng/button";
import {PanZoomService} from "../pan-zoom.service";
import {TooltipModule} from "primeng/tooltip";
import {ThemeService} from "../../core/models/theme.service";
import {AppStateService} from "../../core/app-state.service";

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
  @HostListener('click', ['$event'])
  onClick($event: MouseEvent) {
    $event.stopPropagation();
  }

  constructor(protected undoRedoService: UndoRedoService,
              protected panZoomService: PanZoomService,
              protected themeService: ThemeService,
              protected appStateService: AppStateService) {
  }
}
