import { Directive, ElementRef, inject } from '@angular/core';
import {
  FOCUSABLE_CONTROL_SELECTOR,
  PropertiesKeyboardNavigationService,
} from './properties-keyboard-navigation.service';

@Directive({
  selector: '[appPropertiesControlKeyboard]',
  host: {
    '(keydown)': 'onKeydown($event)',
  },
})
export class PropertiesControlKeyboardDirective {
  private readonly elementRef = inject(ElementRef<HTMLElement>);
  private readonly navService = inject(PropertiesKeyboardNavigationService, {
    optional: true,
  });

  protected onKeydown(event: KeyboardEvent): void {
    if (!this.navService) return;

    switch (event.key) {
      case 'ArrowLeft':
        if (this.isCursorAtStart(event.target)) {
          event.preventDefault();
          this.navService.returnFocusToRow();
        }
        break;
      case 'ArrowRight':
        if (this.isCursorAtEnd(event.target)) {
          event.preventDefault();
          this.focusNextElement();
        }
        break;
      case 'Escape':
        event.preventDefault();
        this.navService.clearAndFocusCanvas();
        break;
    }
  }

  private isCursorAtStart(target: EventTarget | null): boolean {
    if (
      target instanceof HTMLInputElement ||
      target instanceof HTMLTextAreaElement
    ) {
      return target.selectionStart === 0 && target.selectionEnd === 0;
    }
    return true;
  }

  private isCursorAtEnd(target: EventTarget | null): boolean {
    if (
      target instanceof HTMLInputElement ||
      target instanceof HTMLTextAreaElement
    ) {
      const length = target.value?.length ?? 0;
      return target.selectionStart === length && target.selectionEnd === length;
    }
    return true;
  }

  private focusNextElement(): void {
    const currentElement = this.elementRef.nativeElement;
    const propertyRow = currentElement.closest('.property-row');
    if (!propertyRow) return;

    const focusables = Array.from(
      propertyRow.querySelectorAll(FOCUSABLE_CONTROL_SELECTOR),
    ) as HTMLElement[];

    const currentIndex = focusables.indexOf(currentElement);
    if (currentIndex >= 0 && currentIndex < focusables.length - 1) {
      focusables[currentIndex + 1].focus();
    }
  }
}
