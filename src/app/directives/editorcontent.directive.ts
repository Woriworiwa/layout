import {Directive, ElementRef, EventEmitter, HostBinding, HostListener, Input, Output} from "@angular/core";
import {CanvasItem} from "../models/canvas-item.model";

@Directive({
  selector: '[app-editable-content]',
  standalone: true,
  host: {
    '[attr.tabindex]' : '-1',
    '[class.editable]' : 'true',
  }
})
export class EditorContentDirective {
  @Input() item: CanvasItem | undefined;

  @Output() contentChanged = new EventEmitter<{ key: string , content: string }>();

  @HostBinding('attr.contenteditable')
  editMode = false;

  @HostListener('dblclick', ['$event'])
  onDoubleClick($event:any) {
    $event.stopPropagation();
    this.editMode = true;
    this.elementRef.nativeElement.focus();

    this.moveCursorToEnd();
  }

  @HostListener('blur', ['$event'])
  onBlur($event:any) {
    $event.stopPropagation();
    this.editMode = false;
  }

  @HostListener('input', ['$event'])
  onInputChanged($event:any) {
    $event.stopPropagation();
    this.contentChanged.emit({key: this.item?.key!, content: $event.target.innerText});
  }

  /*prevent propagation so the grab event on the canvas will not fire*/
  @HostListener('keydown', ['$event'])
  onKeyDown(event:any) {
    event.stopPropagation();
  }

  constructor(private elementRef: ElementRef) {
  }

  private moveCursorToEnd() {
    const range = document.createRange();
    const selection = window.getSelection();
    range.setStart(this.elementRef.nativeElement, this.elementRef.nativeElement.childNodes.length);
    range.collapse(true);
    selection?.removeAllRanges();
    selection?.addRange(range)
  }
}
