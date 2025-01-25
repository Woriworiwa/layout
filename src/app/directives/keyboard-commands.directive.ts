import {Directive, HostListener} from "@angular/core";
import {CopyPasteService} from "../services/copy-paste.service";
import {CanvasService} from "../services/canvas.service";
import {SelectionService} from "../services/selection.service";

@Directive({
  selector: '[appKeyboardCommands]',
  standalone: true,
})
export class KeyboardCommandsDirective {
  constructor(private copyPasteService: CopyPasteService,
              private canvasService: CanvasService,
              private selectionService: SelectionService) {
  }

  @HostListener('keydown.control.v', ['$event'])
  @HostListener('keydown.meta.v', ['$event'])
  onPaste($event: KeyboardEvent) {
    if (this.isTextElementInEditMode($event.target)) {
      return;
    }

    this.copyPasteService.paste();
  }

  @HostListener('keydown.control.c', ['$event'])
  @HostListener('keydown.meta.c', ['$event'])
  onCopy($event: KeyboardEvent) {
    if (this.isTextElementInEditMode($event.target)) {
      return;
    }

    $event.stopPropagation();
    this.copyPasteService.copy();
  }

  @HostListener('keydown.delete', ['$event'])
  onDelete($event: KeyboardEvent) {
    if (this.isTextElementInEditMode($event.target)) {
      return;
    }

    $event.stopPropagation();
    this.canvasService.deleteItem(this.selectionService.selectedItem?.key);
  }

  private isTextElementInEditMode(eventTarget: EventTarget | null): boolean {
    return (eventTarget as HTMLElement).contentEditable === 'true';
  }
}
