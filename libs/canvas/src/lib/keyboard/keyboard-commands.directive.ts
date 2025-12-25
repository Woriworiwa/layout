import { Directive, HostListener, inject } from '@angular/core';
import { CopyPasteService } from '../copy-paste/copy-paste.service';
import { CanvasService } from '../canvas.service';
import { SelectionService } from '../selection/selection.service';

@Directive({
  selector: '[appKeyboardCommands]',
  standalone: true,
})
export class KeyboardCommandsDirective {
  private copyPasteService = inject(CopyPasteService);
  private canvasService = inject(CanvasService);
  private selectionService = inject(SelectionService);

  @HostListener('keydown.control.v', ['$event'])
  @HostListener('keydown.meta.v', ['$event'])
  onPaste($event: Event) {
    if (this.isTextElementInEditMode($event.target)) {
      return;
    }

    this.copyPasteService.paste();
  }

  @HostListener('keydown.control.c', ['$event'])
  @HostListener('keydown.meta.c', ['$event'])
  onCopy($event: Event) {
    if (this.isTextElementInEditMode($event.target)) {
      return;
    }

    $event.stopPropagation();
    this.copyPasteService.copy();
  }

  @HostListener('keydown.delete', ['$event'])
  onDelete($event: Event) {
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
