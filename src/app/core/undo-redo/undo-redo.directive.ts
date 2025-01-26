import {Directive, HostListener} from "@angular/core";
import {UndoRedoService} from "./undo-redo.service";

@Directive({
  selector: '[appUndoRedo]',
  standalone: true,
})
export class UndoRedoDirective {
  constructor(private undoRedoService: UndoRedoService) {
  }

  /* undo */
  @HostListener('document:keydown.control.z', ['$event'])
  onUndo($event: KeyboardEvent) {
    $event.stopPropagation();
    this.undoRedoService.undo();
  }

  /* redo */
  @HostListener('document:keydown.control.y', ['$event'])
  onRedo($event: KeyboardEvent) {
    $event.stopPropagation();
    this.undoRedoService.redo();
  }
}
