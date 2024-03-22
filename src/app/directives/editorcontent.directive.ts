import {Directive, ElementRef, EventEmitter, HostBinding, HostListener, Input, Output} from "@angular/core";

@Directive({
  selector: '[app-editable-content]',
  standalone: true,
  host: {
    '[attr.tabindex]' : '-1',
    '[class.editable]' : 'true',
  }
})
export class EditorContentDirective {
  @Input() key: string | undefined;

  @Output() frameContentChanged = new EventEmitter<{ key: string , content: string }>();

  @HostBinding('attr.contenteditable')
  editMode = false;

  @HostListener('dblclick', ['$event'])
  onDoubleClick($event:any) {
    $event.stopPropagation();
    this.editMode = true;
    this.elementRef.nativeElement.childNodes[0].focus();

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
    this.frameContentChanged.emit({key: this.key!, content: $event.target.childNodes[0].innerText});
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
