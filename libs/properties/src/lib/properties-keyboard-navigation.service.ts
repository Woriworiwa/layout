import { Injectable, inject, signal, computed } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { PropertiesService } from './properties.service';
import { CANVAS_ROOT_ELEMENT_ID } from '@layout/canvas';

/** Selector for focusable form controls, excluding checkboxes */
export const FOCUSABLE_CONTROL_SELECTOR =
  'input:not([disabled]):not([type="checkbox"]), button:not([disabled]):not(.p-checkbox-box), select:not([disabled]), textarea:not([disabled]), [contenteditable="true"]';

export interface RegisteredRow {
  element: HTMLElement;
  groupExpand: (() => void) | null;
  isVisible: () => boolean;
  focusFirstControl: () => HTMLElement | null;
}

@Injectable()
export class PropertiesKeyboardNavigationService {
  private readonly document = inject(DOCUMENT);
  private readonly propertiesService = inject(PropertiesService);

  private readonly registeredRows = signal<Map<HTMLElement, RegisteredRow>>(
    new Map(),
  );

  private currentFocusedElement = signal<HTMLElement | null>(null);

  readonly visibleRows = computed(() => {
    const rows = Array.from(this.registeredRows().values());
    return rows
      .filter((row) => row.isVisible())
      .sort((a, b) => {
        const position = a.element.compareDocumentPosition(b.element);
        return position & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;
      });
  });

  registerRow(
    element: HTMLElement,
    isVisible: () => boolean,
    focusFirstControl: () => HTMLElement | null,
    groupExpand: (() => void) | null,
  ): void {
    this.registeredRows.update((rows) => {
      const newRows = new Map(rows);
      newRows.set(element, { element, isVisible, focusFirstControl, groupExpand });
      return newRows;
    });
  }

  unregisterRow(element: HTMLElement): void {
    this.registeredRows.update((rows) => {
      const newRows = new Map(rows);
      newRows.delete(element);
      return newRows;
    });
  }

  focusFirstRow(): void {
    const rows = this.visibleRows();
    if (rows.length > 0) {
      this.focusRow(rows[0]);
    }
  }

  focusLastRow(): void {
    const rows = this.visibleRows();
    if (rows.length > 0) {
      this.focusRow(rows[rows.length - 1]);
    }
  }

  focusNextRow(): void {
    const rows = this.visibleRows();
    const currentIndex = this.getCurrentRowIndex(rows);

    if (currentIndex < rows.length - 1) {
      this.focusRow(rows[currentIndex + 1]);
    }
  }

  focusPreviousRow(): void {
    const rows = this.visibleRows();
    const currentIndex = this.getCurrentRowIndex(rows);

    if (currentIndex > 0) {
      this.focusRow(rows[currentIndex - 1]);
    }
  }

  focusRowControl(): void {
    const currentElement = this.currentFocusedElement();
    if (!currentElement) return;

    const row = this.registeredRows().get(currentElement);
    if (row) {
      row.focusFirstControl();
    }
  }

  returnFocusToRow(): void {
    const currentElement = this.currentFocusedElement();
    if (currentElement) {
      currentElement.focus();
    }
  }

  setCurrentFocusedElement(element: HTMLElement | null): void {
    this.currentFocusedElement.set(element);
  }

  clearAndFocusCanvas(): void {
    this.propertiesService.searchText.set('');
    this.currentFocusedElement.set(null);

    const canvas = this.document.getElementById(CANVAS_ROOT_ELEMENT_ID);
    if (canvas) {
      canvas.focus();
    }
  }

  private focusRow(row: RegisteredRow): void {
    // Auto-expand group if collapsed
    if (row.groupExpand) {
      row.groupExpand();
    }

    row.element.focus();
    this.currentFocusedElement.set(row.element);
  }

  private getCurrentRowIndex(rows: RegisteredRow[]): number {
    const currentElement = this.currentFocusedElement();
    if (!currentElement) return -1;

    return rows.findIndex((row) => row.element === currentElement);
  }
}
