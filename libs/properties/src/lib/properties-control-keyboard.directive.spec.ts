import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { PropertiesControlKeyboardDirective } from './properties-control-keyboard.directive';
import { PropertiesKeyboardNavigationService } from './properties-keyboard-navigation.service';
import { PropertiesService } from './properties.service';
import { CanvasService } from '@layout/canvas';

@Component({
  template: `
    <div class="property-row">
      <input appPropertiesControlKeyboard type="text" />
      <button appPropertiesControlKeyboard>Click</button>
    </div>
  `,
  imports: [PropertiesControlKeyboardDirective],
})
class TestHostComponent {}

describe('PropertiesControlKeyboardDirective', () => {
  let navService: PropertiesKeyboardNavigationService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [
        PropertiesKeyboardNavigationService,
        PropertiesService,
        { provide: CanvasService, useValue: {} },
      ],
    }).compileComponents();

    navService = TestBed.inject(PropertiesKeyboardNavigationService);
  });

  describe('WHEN user presses Escape on a control', () => {
    it('SHOULD clear search and focus canvas', () => {
      const fixture = TestBed.createComponent(TestHostComponent);
      fixture.detectChanges();

      const input = fixture.nativeElement.querySelector('input');
      const clearSpy = vi.spyOn(navService, 'clearAndFocusCanvas');

      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));

      expect(clearSpy).toHaveBeenCalled();
    });
  });

  describe('WHEN user presses ArrowLeft at cursor position 0', () => {
    it('SHOULD return focus to the row', () => {
      const fixture = TestBed.createComponent(TestHostComponent);
      fixture.detectChanges();

      const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
      input.value = 'test';
      input.setSelectionRange(0, 0);

      const returnSpy = vi.spyOn(navService, 'returnFocusToRow');

      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }));

      expect(returnSpy).toHaveBeenCalled();
    });
  });

  describe('WHEN user presses ArrowLeft with cursor in middle of text', () => {
    it('SHOULD NOT return focus to the row', () => {
      const fixture = TestBed.createComponent(TestHostComponent);
      fixture.detectChanges();

      const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
      input.value = 'test';
      input.setSelectionRange(2, 2);

      const returnSpy = vi.spyOn(navService, 'returnFocusToRow');

      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }));

      expect(returnSpy).not.toHaveBeenCalled();
    });
  });

  describe('WHEN user presses ArrowLeft on a button', () => {
    it('SHOULD return focus to the row', () => {
      const fixture = TestBed.createComponent(TestHostComponent);
      fixture.detectChanges();

      const button = fixture.nativeElement.querySelector('button');
      const returnSpy = vi.spyOn(navService, 'returnFocusToRow');

      button.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }));

      expect(returnSpy).toHaveBeenCalled();
    });
  });

  describe('WHEN user presses ArrowRight at end of text', () => {
    it('SHOULD focus the next element', () => {
      const fixture = TestBed.createComponent(TestHostComponent);
      fixture.detectChanges();

      const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
      const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
      input.value = 'test';
      input.setSelectionRange(4, 4);

      const focusSpy = vi.spyOn(button, 'focus');

      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));

      expect(focusSpy).toHaveBeenCalled();
    });
  });
});
