import {Directive, ElementRef, EventEmitter, HostBinding, HostListener, Input, Output} from "@angular/core";
import {CanvasItem} from "../models/canvas-item.model";
import {BehaviorSubject, debounceTime} from "rxjs";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {SelectionService} from "../services/selection.service";

/*
* this directive adds the ability to edit the content of an element by double clicking on it.
* it offers a simple way to edit the content of an element without the need to create a form or a modal.
* it works by simple setting @HostBinding('attr.contenteditable') to true when the element is double clicked.
* */
@Directive({
  selector: '[app-editable-content]',
  standalone: true,
  host: {
    '[attr.tabindex]': '-1',
    '[class.editable]': 'true',
  }
})
export class EditorContentDirective {
  @HostBinding('attr.contenteditable')
  editMode = false;

  @Input() item: CanvasItem | undefined;
  @Output() contentChanged = new EventEmitter<{ key: string, content: string }>();

  @HostListener('dblclick', ['$event'])
  onDoubleClick($event: any) {
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
  }

  @HostListener('input', ['$event'])
  onInputChanged($event: any) {
    $event.stopPropagation();
    this.inputChangedStream$.next($event.target.innerText);
  }

  /*prevent propagation so the grab event on the canvas will not fire*/
  @HostListener('keydown', ['$event'])
  onKeyDown(event: any) {
    event.stopPropagation();

    if (event.key === 'Enter') {
      this.contentChanged.emit({key: this.item?.key!, content: this.elementRef.nativeElement.innerText});
      this.selectionService.setVisibility('visible');
    }
  }

  private inputChangedStream$: BehaviorSubject<string | undefined> = new BehaviorSubject<string | undefined>(undefined);

  constructor(private elementRef: ElementRef,
              private selectionService: SelectionService) {
    // this.inputChangedStream$
    //   .pipe(
    //     debounceTime(250),
    //     takeUntilDestroyed()
    //   )
    //   .subscribe((value) => {
    //     if (!value) {
    //       return;
    //     }
    //
    //     this.contentChanged.emit({key: this.item?.key!, content: value});
    //   });
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
