import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TailwindPanelComponent } from './tailwind-panel.component';
import { TailwindCssConverter } from '@layout/serialization';
import { CanvasService } from '@layout/canvas';
import { THEME_CONFIG } from '@layout/shared';
import { Css } from '@layout/models';
import { Component, signal } from '@angular/core';

// Test host component to test input bindings
@Component({
  template: `
    <app-tailwind-panel
      [css]="css()"
      [tailwindClasses]="tailwindClasses()"
      [hasSelection]="hasSelection()"
      [compact]="compact()"
    />
  `,
  imports: [TailwindPanelComponent],
})
class TestHostComponent {
  css = signal<Css | undefined>(undefined);
  tailwindClasses = signal<string | undefined>(undefined);
  hasSelection = signal(false);
  compact = signal(false);
}

describe('TailwindPanelComponent', () => {
  let component: TailwindPanelComponent;
  let fixture: ComponentFixture<TailwindPanelComponent>;
  let mockConverter: {
    cssToTailwind: ReturnType<typeof vi.fn>;
    tailwindToCss: ReturnType<typeof vi.fn>;
  };
  let mockCanvasService: {
    updateCss: ReturnType<typeof vi.fn>;
    updateTailwindClasses: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    mockConverter = {
      cssToTailwind: vi.fn().mockReturnValue([]),
      tailwindToCss: vi.fn().mockReturnValue({ css: {}, unsupportedClasses: [] }),
    };

    mockCanvasService = {
      updateCss: vi.fn(),
      updateTailwindClasses: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [TailwindPanelComponent],
      providers: [
        { provide: TailwindCssConverter, useValue: mockConverter },
        { provide: CanvasService, useValue: mockCanvasService },
        { provide: THEME_CONFIG, useValue: { darkMode: false } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TailwindPanelComponent);
    component = fixture.componentInstance;
  });

  describe('WHEN component is created', () => {
    it('SHOULD create the component', () => {
      expect(component).toBeTruthy();
    });

    it('SHOULD have default input values', () => {
      expect(component.css()).toBeUndefined();
      expect(component.tailwindClasses()).toBeUndefined();
      expect(component.hasSelection()).toBe(false);
      expect(component.compact()).toBe(false);
    });
  });

  describe('WHEN hasSelection is false', () => {
    it('SHOULD not render content in compact mode', () => {
      fixture.componentRef.setInput('hasSelection', false);
      fixture.componentRef.setInput('compact', true);
      fixture.detectChanges();

      const content = fixture.nativeElement.querySelector('.flex');
      expect(content).toBeNull();
    });

    it('SHOULD render no selection message in non-compact mode', () => {
      fixture.componentRef.setInput('hasSelection', false);
      fixture.componentRef.setInput('compact', false);
      fixture.detectChanges();

      const message = fixture.nativeElement.textContent;
      expect(message).toContain('No element selected');
    });
  });

  describe('WHEN hasSelection is true', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('hasSelection', true);
    });

    it('SHOULD render editor in compact mode', () => {
      fixture.componentRef.setInput('compact', true);
      fixture.detectChanges();

      const label = fixture.nativeElement.textContent;
      expect(label).toContain('Tailwind Classes');
    });

    it('SHOULD render full panel in non-compact mode', () => {
      fixture.componentRef.setInput('compact', false);
      fixture.detectChanges();

      const header = fixture.nativeElement.textContent;
      expect(header).toContain('Tailwind CSS');
    });
  });

  describe('WHEN CSS input changes', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('hasSelection', true);
      fixture.componentRef.setInput('compact', true);
    });

    it('SHOULD convert CSS to Tailwind classes', async () => {
      const css: Css = { layout: { display: 'flex' } };
      mockConverter.cssToTailwind.mockReturnValue(['flex']);
      mockConverter.tailwindToCss.mockReturnValue({ css: {}, unsupportedClasses: [] });

      fixture.componentRef.setInput('css', css);
      fixture.detectChanges();
      await fixture.whenStable();

      expect(mockConverter.cssToTailwind).toHaveBeenCalledWith(css);
    });

    it('SHOULD combine CSS-derived classes with extra unsupported classes', async () => {
      const css: Css = { layout: { display: 'flex' } };
      mockConverter.cssToTailwind.mockReturnValue(['flex']);
      mockConverter.tailwindToCss.mockReturnValue({ css: {}, unsupportedClasses: ['bg-blue-500'] });

      fixture.componentRef.setInput('css', css);
      fixture.componentRef.setInput('tailwindClasses', 'bg-blue-500');
      fixture.detectChanges();
      await fixture.whenStable();

      expect(mockConverter.cssToTailwind).toHaveBeenCalled();
      expect(mockConverter.tailwindToCss).toHaveBeenCalledWith('bg-blue-500');
    });
  });

  describe('WHEN user edits Tailwind classes', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('hasSelection', true);
      fixture.componentRef.setInput('compact', true);
      fixture.detectChanges();
    });

    it('SHOULD parse classes and update CSS', async () => {
      const parsedResult = {
        css: { layout: { display: 'flex' } },
        unsupportedClasses: [],
      };
      mockConverter.tailwindToCss.mockReturnValue(parsedResult);

      component['onEditorChange']('flex');

      expect(mockConverter.tailwindToCss).toHaveBeenCalledWith('flex');
      expect(mockCanvasService.updateCss).toHaveBeenCalled();
    });

    it('SHOULD update tailwindClasses with unsupported classes', () => {
      const parsedResult = {
        css: { layout: { display: 'flex' } },
        unsupportedClasses: ['bg-blue-500', 'text-white'],
      };
      mockConverter.tailwindToCss.mockReturnValue(parsedResult);

      component['onEditorChange']('flex bg-blue-500 text-white');

      expect(mockCanvasService.updateTailwindClasses).toHaveBeenCalledWith('bg-blue-500 text-white');
    });

    it('SHOULD handle empty input', () => {
      mockConverter.tailwindToCss.mockReturnValue({ css: {}, unsupportedClasses: [] });

      component['onEditorChange']('');

      expect(mockCanvasService.updateCss).toHaveBeenCalled();
      expect(mockCanvasService.updateTailwindClasses).toHaveBeenCalledWith('');
    });
  });

  describe('computed signals', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('hasSelection', true);
    });

    it('SHOULD compute syncedClassCount from CSS', async () => {
      mockConverter.cssToTailwind.mockReturnValue(['flex', 'gap-4', 'items-center']);
      mockConverter.tailwindToCss.mockReturnValue({ css: {}, unsupportedClasses: [] });

      const css: Css = {
        layout: { display: 'flex' },
        flexboxGrid: { gap: '1rem', alignItems: 'center' },
      };
      fixture.componentRef.setInput('css', css);
      fixture.detectChanges();
      await fixture.whenStable();

      // syncedClassCount is computed from cssToTailwind result length
      expect(mockConverter.cssToTailwind).toHaveBeenCalled();
    });

    it('SHOULD track unsupportedClasses from tailwindClasses input', async () => {
      mockConverter.cssToTailwind.mockReturnValue([]);
      mockConverter.tailwindToCss.mockReturnValue({
        css: {},
        unsupportedClasses: ['bg-blue-500', 'text-white'],
      });

      fixture.componentRef.setInput('tailwindClasses', 'bg-blue-500 text-white');
      fixture.detectChanges();
      await fixture.whenStable();

      expect(mockConverter.tailwindToCss).toHaveBeenCalledWith('bg-blue-500 text-white');
    });
  });

  describe('WHEN compact mode shows class counts', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('hasSelection', true);
      fixture.componentRef.setInput('compact', true);
    });

    it('SHOULD show synced and extra counts when there are unsupported classes', async () => {
      mockConverter.cssToTailwind.mockReturnValue(['flex']);
      mockConverter.tailwindToCss.mockReturnValue({
        css: {},
        unsupportedClasses: ['bg-blue-500'],
      });

      fixture.componentRef.setInput('css', { layout: { display: 'flex' } });
      fixture.componentRef.setInput('tailwindClasses', 'bg-blue-500');
      fixture.detectChanges();
      await fixture.whenStable();
      fixture.detectChanges();

      const text = fixture.nativeElement.textContent;
      // The template shows "X synced, Y extra" when unsupportedClassCount > 0
      expect(text).toContain('synced');
    });
  });

  describe('dark mode', () => {
    it('SHOULD use dark mode from theme config', async () => {
      await TestBed.resetTestingModule();
      await TestBed.configureTestingModule({
        imports: [TailwindPanelComponent],
        providers: [
          { provide: TailwindCssConverter, useValue: mockConverter },
          { provide: CanvasService, useValue: mockCanvasService },
          { provide: THEME_CONFIG, useValue: { darkMode: true } },
        ],
      }).compileComponents();

      const darkFixture = TestBed.createComponent(TailwindPanelComponent);
      const darkComponent = darkFixture.componentInstance;

      expect(darkComponent['isDarkMode']()).toBe(true);
    });

    it('SHOULD default to false when THEME_CONFIG is not provided', async () => {
      await TestBed.resetTestingModule();
      await TestBed.configureTestingModule({
        imports: [TailwindPanelComponent],
        providers: [
          { provide: TailwindCssConverter, useValue: mockConverter },
          { provide: CanvasService, useValue: mockCanvasService },
        ],
      }).compileComponents();

      const noThemeFixture = TestBed.createComponent(TailwindPanelComponent);
      const noThemeComponent = noThemeFixture.componentInstance;

      expect(noThemeComponent['isDarkMode']()).toBe(false);
    });
  });
});

describe('TailwindPanelComponent with TestHost', () => {
  let hostComponent: TestHostComponent;
  let hostFixture: ComponentFixture<TestHostComponent>;
  let mockConverter: {
    cssToTailwind: ReturnType<typeof vi.fn>;
    tailwindToCss: ReturnType<typeof vi.fn>;
  };
  let mockCanvasService: {
    updateCss: ReturnType<typeof vi.fn>;
    updateTailwindClasses: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    mockConverter = {
      cssToTailwind: vi.fn().mockReturnValue([]),
      tailwindToCss: vi.fn().mockReturnValue({ css: {}, unsupportedClasses: [] }),
    };

    mockCanvasService = {
      updateCss: vi.fn(),
      updateTailwindClasses: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [
        { provide: TailwindCssConverter, useValue: mockConverter },
        { provide: CanvasService, useValue: mockCanvasService },
        { provide: THEME_CONFIG, useValue: { darkMode: false } },
      ],
    }).compileComponents();

    hostFixture = TestBed.createComponent(TestHostComponent);
    hostComponent = hostFixture.componentInstance;
  });

  describe('WHEN inputs are set via host component', () => {
    it('SHOULD update when css signal changes', async () => {
      hostComponent.hasSelection.set(true);
      hostComponent.compact.set(true);
      hostFixture.detectChanges();

      mockConverter.cssToTailwind.mockReturnValue(['flex']);

      hostComponent.css.set({ layout: { display: 'flex' } });
      hostFixture.detectChanges();
      await hostFixture.whenStable();

      expect(mockConverter.cssToTailwind).toHaveBeenCalled();
    });

    it('SHOULD update when tailwindClasses signal changes', async () => {
      hostComponent.hasSelection.set(true);
      hostComponent.compact.set(true);
      hostFixture.detectChanges();

      mockConverter.tailwindToCss.mockReturnValue({
        css: {},
        unsupportedClasses: ['bg-red-500'],
      });

      hostComponent.tailwindClasses.set('bg-red-500');
      hostFixture.detectChanges();
      await hostFixture.whenStable();

      expect(mockConverter.tailwindToCss).toHaveBeenCalledWith('bg-red-500');
    });

    it('SHOULD toggle between compact and full mode', () => {
      hostComponent.hasSelection.set(true);

      hostComponent.compact.set(true);
      hostFixture.detectChanges();
      expect(hostFixture.nativeElement.textContent).toContain('Tailwind Classes');

      hostComponent.compact.set(false);
      hostFixture.detectChanges();
      expect(hostFixture.nativeElement.textContent).toContain('Tailwind CSS');
    });
  });
});
