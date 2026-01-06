import { inject, Injectable, OnDestroy, signal } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { TabOption } from '../../shared/tab-switcher/tab-switcher.component';
import { UiGuidanceService } from './ui-guidance.service';

@Injectable({
  providedIn: 'root',
})
export class LayoutStateService implements OnDestroy {
  private uiGuidanceService = inject(UiGuidanceService);
  private destroy$ = new Subject<void>();

  leftPanelMode = signal<'assets' | 'layers-panel'>('assets');

  leftPanelOptions: TabOption[] = [
    { label: 'Assets', value: 'assets', icon: 'pi pi-plus' },
    { label: 'Layers', value: 'layers-panel', icon: 'pi pi-comment' },
  ];

  constructor() {
    this.initializeUiGuidanceSubscription();
  }

  private initializeUiGuidanceSubscription(): void {
    this.uiGuidanceService.guidanceEvent$
      .pipe(takeUntil(this.destroy$))
      .subscribe((event) => {
        if (
          event.target === 'layers-panel-panel' &&
          event.action === 'highlight'
        ) {
          // Switch to layers-panel panel if not already visible
          if (this.leftPanelMode() !== 'layers-panel') {
            this.leftPanelMode.set('layers-panel');
            // Give Angular time to render the layers-panel component before showing the message
            setTimeout(() => {
              // Re-emit the event so the now-visible layers-panel component can handle it
              this.uiGuidanceService.highlightLayersPanel();
            }, 100);
          }
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
