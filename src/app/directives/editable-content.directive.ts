import {
  ChangeDetectorRef,
  Directive,
  ElementRef,
  EventEmitter,
  HostBinding,
  HostListener,
  Input,
  Output
} from "@angular/core";
import {CanvasItem} from "../models/canvas-item.model";
import {BehaviorSubject, distinctUntilChanged} from "rxjs";
import {SelectionService} from "../services/selection.service";

/*
* this directive adds the ability to edit the content of an element by double clicking on it.
* it offers a simple way to edit the content of an element without the need to create a form or a modal.
* it works by simple setting @HostBinding('attr.contenteditable') to true when the element is double clicked.
* */
@Directive({
  selector: '[appEditableContent]',
  standalone: true,
  host: {
    '[attr.tabindex]': '-1',
    '[class.editable]': 'true',
  }
})
export class EditableContentDirective {
  @HostBinding('attr.contenteditable')
  editMode = false;

  @Input() item: CanvasItem | undefined;
  @Output() contentChanged = new EventEmitter<{ key: string, content: string }>();

  @HostListener('dblclick', ['$event'])
  onDoubleClick($event: MouseEvent) {
    $event.stopPropagation();
    this.editMode = true;
    this.elementRef.nativeElement.focus();

    this.moveCursorToEnd();
    this.selectionService.setVisibility('hidden');
  }

  @HostListener('blur', ['$event'])
  onBlur($event: any) {
    $event.stopPropagation();
    this.editMode = false;
    if (this.item?.key) {
      this.contentChanged.emit({key: this.item.key, content: this.elementRef.nativeElement.innerText});
    }
  }

  @HostListener('input', ['$event'])
  onInputChanged($event: any) {
    $event.stopPropagation();
    this.inputChangedStream$.next($event.target.innerText);
  }

  /*prevent propagation so the grab event on the canvas will not fire*/
  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    event.stopPropagation();

    const finishEditing = (event.key === 'Enter' && (event.altKey || event.ctrlKey)) || event.key === 'Escape';

    if (finishEditing && this.item?.key) {
      this.editMode = false;
      this.contentChanged.emit({key: this.item.key, content: this.elementRef.nativeElement.innerText});
      this.selectionService.setVisibility('visible');
    }
  }

  private inputChangedStream$: BehaviorSubject<string | undefined> = new BehaviorSubject<string | undefined>(undefined);

  constructor(private elementRef: ElementRef,
              private ref: ElementRef,
              private selectionService: SelectionService) {
    this.selectionService.selectedItem$.pipe(
      distinctUntilChanged((prev, curr) => prev?.key === curr?.key)
    ).subscribe(() => {
      this.ref.nativeElement.blur();
    });
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
