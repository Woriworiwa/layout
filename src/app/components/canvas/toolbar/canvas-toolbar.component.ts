import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {UndoRedoService} from "../../../services/undo-redo.service";
import {ButtonModule} from "primeng/button";

@Component({
  selector: 'app-canvas-toolbar',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  templateUrl: './canvas-toolbar.component.html',
  styleUrl: './canvas-toolbar.component.scss'
})
export class CanvasToolbarComponent {
  constructor(protected undoRedoService: UndoRedoService) {
  }

  protected readonly UndoRedoService = UndoRedoService;
}
