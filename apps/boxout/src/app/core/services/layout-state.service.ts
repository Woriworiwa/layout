import { inject, Injectable, OnDestroy, signal } from '@angular/core';
import { Subject, takeUntil, filter, tap, delay } from 'rxjs';
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

  rightPanelMode = signal<'properties' | 'inspector'>('properties');

  rightPanelOptions: TabOption[] = [
    { label: 'Properties', value: 'properties', icon: 'pi pi-sliders-h' },
    { label: 'Inspector', value: 'inspector', icon: 'pi pi-code' },
  ];

  constructor() {
    this.initializeUiGuidanceSubscription();
  }

  private initializeUiGuidanceSubscription(): void {
    this.uiGuidanceService.guidanceEvent$
      .pipe(
        takeUntil(this.destroy$),
        filter(
          (event) =>
            event.target === 'layers-panel-panel' &&
            event.action === 'highlight' &&
            this.leftPanelMode() !== 'layers-panel'
        ),
        tap(() => this.leftPanelMode.set('layers-panel')),
        delay(100)
      )
      .subscribe(() => {
        this.uiGuidanceService.highlightLayersPanel();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
