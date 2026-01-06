import { TestBed } from '@angular/core/testing';
import { Subject } from 'rxjs';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { LayoutStateService } from './layout-state.service';
import { UiGuidanceService, GuidanceEvent } from './ui-guidance.service';

describe('LayoutStateService', () => {
  let service: LayoutStateService;
  let guidanceEvents$: Subject<GuidanceEvent>;
  let mockGuidanceService: {
    guidanceEvent$: Subject<GuidanceEvent>;
    highlightLayersPanel: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    guidanceEvents$ = new Subject<GuidanceEvent>();

    mockGuidanceService = {
      guidanceEvent$: guidanceEvents$,
      highlightLayersPanel: vi.fn()
    };

    TestBed.configureTestingModule({
      providers: [
        LayoutStateService,
        {
          provide: UiGuidanceService,
          useValue: mockGuidanceService
        }
      ]
    });

    service = TestBed.inject(LayoutStateService);
  });

  afterEach(() => {
    guidanceEvents$.complete();
  });

  describe('WHEN service initializes', () => {
    it('SHOULD set leftPanelMode to assets', () => {
      expect(service.leftPanelMode()).toBe('assets');
    });

    it('SHOULD provide leftPanelOptions with correct structure', () => {
      const options = service.leftPanelOptions;

      expect(options).toHaveLength(2);
      expect(options[0]).toEqual({
        label: 'Assets',
        value: 'assets',
        icon: 'pi pi-plus'
      });
      expect(options[1]).toEqual({
        label: 'Layers',
        value: 'layers-panel',
        icon: 'pi pi-comment'
      });
    });
  });

  describe('WHEN UI guidance event targets layers-panel with highlight action', () => {
    it('SHOULD switch leftPanelMode to layers-panel', () => {
      return new Promise<void>((resolve) => {
        const guidanceEvent: GuidanceEvent = {
          target: 'layers-panel-panel',
          action: 'highlight'
        };

        guidanceEvents$.next(guidanceEvent);

        setTimeout(() => {
          expect(service.leftPanelMode()).toBe('layers-panel');
          resolve();
        }, 10);
      });
    });

    it('SHOULD call highlightLayersPanel after 100ms delay', () => {
      return new Promise<void>((resolve) => {
        const guidanceEvent: GuidanceEvent = {
          target: 'layers-panel-panel',
          action: 'highlight'
        };

        guidanceEvents$.next(guidanceEvent);

        // Verify not called immediately
        expect(mockGuidanceService.highlightLayersPanel).not.toHaveBeenCalled();

        setTimeout(() => {
          expect(mockGuidanceService.highlightLayersPanel).toHaveBeenCalledTimes(1);
          resolve();
        }, 150);
      });
    });

    it('SHOULD switch panel before calling highlightLayersPanel', () => {
      return new Promise<void>((resolve) => {
        const guidanceEvent: GuidanceEvent = {
          target: 'layers-panel-panel',
          action: 'highlight'
        };

        guidanceEvents$.next(guidanceEvent);

        setTimeout(() => {
          expect(service.leftPanelMode()).toBe('layers-panel');
          expect(mockGuidanceService.highlightLayersPanel).toHaveBeenCalled();
          resolve();
        }, 150);
      });
    });

    it('SHOULD NOT switch panel if already on layers-panel', () => {
      return new Promise<void>((resolve) => {
        // Set panel to layers-panel first
        service.leftPanelMode.set('layers-panel');

        const guidanceEvent: GuidanceEvent = {
          target: 'layers-panel-panel',
          action: 'highlight'
        };

        guidanceEvents$.next(guidanceEvent);

        setTimeout(() => {
          // Should still be on layers-panel
          expect(service.leftPanelMode()).toBe('layers-panel');
          // Should NOT call highlightLayersPanel since we didn't switch
          expect(mockGuidanceService.highlightLayersPanel).not.toHaveBeenCalled();
          resolve();
        }, 150);
      });
    });
  });

  describe('WHEN UI guidance event has different target or action', () => {
    it('SHOULD NOT switch leftPanelMode for different target', () => {
      const guidanceEvent = {
        target: 'properties-panel',
        action: 'highlight'
      } as GuidanceEvent;

      guidanceEvents$.next(guidanceEvent);

      expect(service.leftPanelMode()).toBe('assets');
    });

    it('SHOULD NOT call highlightLayersPanel for different target', () => {
      return new Promise<void>((resolve) => {
        const guidanceEvent = {
          target: 'canvas-toolbar',
          action: 'highlight'
        } as GuidanceEvent;

        guidanceEvents$.next(guidanceEvent);

        setTimeout(() => {
          expect(mockGuidanceService.highlightLayersPanel).not.toHaveBeenCalled();
          resolve();
        }, 150);
      });
    });

    it('SHOULD NOT switch leftPanelMode for different action', () => {
      const guidanceEvent = {
        target: 'layers-panel-panel',
        action: 'click'
      } as GuidanceEvent;

      guidanceEvents$.next(guidanceEvent);

      expect(service.leftPanelMode()).toBe('assets');
    });
  });

  describe('WHEN service is destroyed', () => {
    it('SHOULD unsubscribe from UI guidance events', () => {
      return new Promise<void>((resolve) => {
        const guidanceEvent: GuidanceEvent = {
          target: 'layers-panel-panel',
          action: 'highlight'
        };

        service.ngOnDestroy();

        // Emit after destroy
        guidanceEvents$.next(guidanceEvent);

        setTimeout(() => {
          // Panel mode should not change after destroy
          expect(service.leftPanelMode()).toBe('assets');
          expect(mockGuidanceService.highlightLayersPanel).not.toHaveBeenCalled();
          resolve();
        }, 150);
      });
    });

    it('SHOULD complete destroy$ subject', () => {
      const destroySpy = vi.spyOn(service['destroy$'], 'complete');

      service.ngOnDestroy();

      expect(destroySpy).toHaveBeenCalled();
    });
  });
});
