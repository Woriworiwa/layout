import {
  Component,
  input,
  signal,
  effect,
  contentChildren,
  computed,
  inject,
} from '@angular/core';

import { PropertyRowComponent } from '../property-components/property-row.component';
import { PropertiesService } from '../properties.service';

@Component({
  selector: 'app-property-group',
  imports: [],
  template: `
    @if (hasVisibleRows()) {
      <div class="border-b border-surface px-4">
        <div
          class="flex items-center gap-2 px-1 py-3 pl-0 cursor-pointer transition-colors hover:bg-surface-hover"
          (click)="toggleCollapsed()">
          <div class="m-0 text-sm flex-1">{{ header() }}</div>
          <button
            type="button"
            class="flex items-center justify-center w-5 h-5 p-0 border-0 bg-transparent text-muted-color cursor-pointer transition-transform duration-200 shrink-0"
            [class.rotate-0]="isCollapsed()"
            [class.rotate-90]="!isCollapsed()">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M4 2L8 6L4 10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
                    stroke-linejoin="round" />
            </svg>
          </button>
        </div>

        @if (!isCollapsed()) {
          <div class="flex flex-col gap-2 pb-4">
            <ng-content />
          </div>
        }
      </div>
    }
  `
})
export class PropertyGroupContainerComponent {
  header = input<string>('');
  toggleable = input<boolean>(true);
  collapsed = input<boolean>(false);

  protected _collapsed = signal(false);
  protected isCollapsed = this._collapsed.asReadonly();

  // Track the original collapsed state before filtering
  private originalCollapsedState = signal<boolean | null>(null);

  // Get all property rows inside this group
  private propertyRows = contentChildren(PropertyRowComponent, { descendants: true });

  private propertiesService = inject(PropertiesService);

  // Computed signal to check if any rows are visible
  hasVisibleRows = computed(() => {
    const rows = this.propertyRows();
    if (rows.length === 0) {
      return true; // If no rows, show the group (for groups with other content)
    }
    return rows.some(row => row.isVisible());
  });

  constructor() {
    effect(() => {
      this._collapsed.set(this.collapsed());
    });

    // Effect to handle auto-expand/collapse based on filter
    effect(() => {
      const searchText = this.propertiesService.searchText();
      const rows = this.propertyRows();

      if (searchText && rows.length > 0) {
        // Filter is active
        // Store original state if not already stored
        if (this.originalCollapsedState() === null) {
          this.originalCollapsedState.set(this._collapsed());
        }

        // Check if any rows match the filter
        const hasMatchingRows = rows.some(row => row.isVisible());

        // Expand if there are matching rows
        if (hasMatchingRows) {
          this._collapsed.set(false);
        }
      } else if (!searchText && this.originalCollapsedState() !== null) {
        // Filter cleared, revert to original state
        const originalState = this.originalCollapsedState();
        if (originalState !== null) {
          this._collapsed.set(originalState);
        }
        this.originalCollapsedState.set(null);
      }
    });
  }

  toggleCollapsed() {
    if (this.toggleable()) {
      this._collapsed.set(!this._collapsed());

      // If user manually toggles while filter is active, update the original state
      if (this.propertiesService.searchText() && this.originalCollapsedState() !== null) {
        this.originalCollapsedState.set(this._collapsed());
      }
    }
  }
}
