import { computed, inject, Injectable, signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { AssetDragDropService, CanvasService } from '@layout/canvas';
import { filter } from 'rxjs';
import { LocalStorageService } from './local-storage.service';

const GUIDE_DISMISSED_KEY = 'GUIDE_DISMISSED';

/**
 * Service managing the landing guide overlay visibility.
 * Shows guide when canvas is empty and user hasn't dismissed it.
 * Auto-dismisses when user starts dragging an asset.
 */
@Injectable({
  providedIn: 'root',
})
export class GuideService {
  private readonly localStorageService = inject(LocalStorageService);
  private readonly assetDragDropService = inject(AssetDragDropService);
  private readonly canvasService = inject(CanvasService);

  private readonly guideDismissed = signal<boolean>(false);
  private readonly canvasItems = toSignal(this.canvasService.items$, {
    initialValue: [],
  });

  /** Whether the landing guide should be shown */
  readonly showGuide = computed(() => {
    const items = this.canvasItems();
    const isEmpty = !items || items.length === 0;
    return isEmpty && !this.guideDismissed();
  });

  constructor() {
    this.loadPersistedState();
    this.setupAutoDismissOnDrag();
  }

  /** Dismiss the guide and persist the state */
  dismissGuide(): void {
    this.guideDismissed.set(true);
    this.localStorageService.setItem(GUIDE_DISMISSED_KEY, true);
  }

  /** Reset the guide state (useful for testing or clearing data) */
  resetGuide(): void {
    this.guideDismissed.set(false);
    this.localStorageService.removeItem(GUIDE_DISMISSED_KEY);
  }

  private loadPersistedState(): void {
    const dismissed = this.localStorageService.getItem<boolean>(
      GUIDE_DISMISSED_KEY,
      false
    );
    this.guideDismissed.set(dismissed ?? false);
  }

  private setupAutoDismissOnDrag(): void {
    this.assetDragDropService.isDragging$
      .pipe(
        takeUntilDestroyed(),
        filter((isDragging) => isDragging && this.showGuide())
      )
      .subscribe(() => {
        this.dismissGuide();
      });
  }
}
