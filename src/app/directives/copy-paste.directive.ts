import {Directive, HostListener} from "@angular/core";
import {CopyPasteService} from "../services/copy-paste.service";

@Directive({
  selector: '[appCopyPaste]',
  standalone: true,
})
export class CopyPasteDirective {
  constructor(private copyPasteService: CopyPasteService) {
  }

  @HostListener('keydown.control.v', ['$event'])
  @HostListener('keydown.meta.v', ['$event'])
  onPaste() {
    this.copyPasteService.paste();
  }

  @HostListener('keydown.control.c', ['$event'])
  @HostListener('keydown.meta.c', ['$event'])
  onCopy($event: any) {
    $event.stopPropagation();
    this.copyPasteService.copy();
  }
}
