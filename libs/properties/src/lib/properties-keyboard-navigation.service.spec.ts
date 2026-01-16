import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { PropertiesKeyboardNavigationService } from './properties-keyboard-navigation.service';
import { PropertiesService } from './properties.service';
import { CanvasService } from '@layout/canvas';

describe('PropertiesKeyboardNavigationService', () => {
  let service: PropertiesKeyboardNavigationService;
  let propertiesService: PropertiesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PropertiesKeyboardNavigationService,
        PropertiesService,
        { provide: CanvasService, useValue: {} },
      ],
    });

    service = TestBed.inject(PropertiesKeyboardNavigationService);
    propertiesService = TestBed.inject(PropertiesService);
  });

  function createRow(visible = true): HTMLElement {
    const element = document.createElement('div');
    element.tabIndex = 0;
    document.body.appendChild(element);
    service.registerRow(element, () => visible, () => null, null);
    return element;
  }

  function cleanup(...elements: HTMLElement[]) {
    elements.forEach((el) => {
      service.unregisterRow(el);
      el.remove();
    });
  }

  describe('WHEN user navigates with arrow keys', () => {
    it('SHOULD focus the first visible row on focusFirstRow', () => {
      const row = createRow();
      const focusSpy = vi.spyOn(row, 'focus');

      service.focusFirstRow();

      expect(focusSpy).toHaveBeenCalled();
      cleanup(row);
    });

    it('SHOULD focus the next row on focusNextRow', () => {
      const row1 = createRow();
      const row2 = createRow();

      service.focusFirstRow();
      const focusSpy = vi.spyOn(row2, 'focus');
      service.focusNextRow();

      expect(focusSpy).toHaveBeenCalled();
      cleanup(row1, row2);
    });

    it('SHOULD skip hidden rows during navigation', () => {
      const visibleRow = createRow(true);
      const hiddenRow = createRow(false);

      expect(service.visibleRows().length).toBe(1);
      expect(service.visibleRows()[0].element).toBe(visibleRow);
      cleanup(visibleRow, hiddenRow);
    });
  });

  describe('WHEN user presses Escape', () => {
    it('SHOULD clear search text', () => {
      propertiesService.searchText.set('padding');

      service.clearAndFocusCanvas();

      expect(propertiesService.searchText()).toBe('');
    });
  });

  describe('WHEN rows are registered and unregistered', () => {
    it('SHOULD track registered rows correctly', () => {
      const row = createRow();
      expect(service.visibleRows().length).toBe(1);

      cleanup(row);
      expect(service.visibleRows().length).toBe(0);
    });
  });
});
