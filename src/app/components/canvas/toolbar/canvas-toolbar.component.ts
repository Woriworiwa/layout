import {Component, HostListener} from '@angular/core';
import { CommonModule } from '@angular/common';
import {UndoRedoService} from "../../../services/undo-redo.service";
import {ButtonModule} from "primeng/button";
import {PanZoomService} from "../../../services/pan-zoom.service";
import {TooltipModule} from "primeng/tooltip";

@Component({
  selector: 'app-canvas-toolbar',
  standalone: true,
  imports: [CommonModule, ButtonModule, TooltipModule],
  templateUrl: './canvas-toolbar.component.html',
  styleUrl: './canvas-toolbar.component.scss'
})
export class CanvasToolbarComponent {
  @HostListener('click', ['$event'])
  onClick($event: MouseEvent) {
    $event.stopPropagation();
  }

  constructor(protected undoRedoService: UndoRedoService,
              protected panZoomService: PanZoomService) {
  }

  protected readonly UndoRedoService = UndoRedoService;
}
