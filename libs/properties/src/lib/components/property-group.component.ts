import {
  Component,
  input,
  signal,
  effect,
  contentChildren,
  computed,
  inject,
} from '@angular/core';

import { PropertyRowComponent } from '../components/property-row.component';
import { PropertiesService } from '../properties.service';
import { LOCAL_STORAGE_SERVICE } from '@layout/shared';

@Component({
  selector: 'app-property-group',
  imports: [],
  template: `
    @if (hasVisibleRows()) {
      <div>
        <div
          class="flex items-center justify-between px-4 py-4 cursor-pointer bg-surface-50 dark:bg-surface-800"
          aria-disabled="true"
          (click)="toggleCollapsed()"
          (keydown)="toggleCollapsed()"
        >
          <h3 class="m-0 text-base font-medium text-surface-900 dark:text-surface-50">
            {{ header() }}
          </h3>
          <button
            type="button"
            class="flex items-center justify-center w-6 h-6 p-0 border-0 bg-transparent text-surface-500 dark:text-surface-400 cursor-pointer transition-transform duration-200 shrink-0"
            [class.rotate-0]="!isCollapsed()"
            [class.-rotate-90]="isCollapsed()"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M4 6L8 10L12 6"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>
        </div>

        @if (!isCollapsed()) {
          <div class="flex flex-col">
            <ng-content />
          </div>
        }
      </div>
    }
  `,
})
export class PropertyGroupComponent {
  header = input<string>('');
  toggleable = input<boolean>(true);
  collapsed = input<boolean>(false);
  groupId = input<string>(''); // Unique identifier for localStorage

  protected _collapsed = signal(false);
  protected isCollapsed = this._collapsed.asReadonly();

  // Track the original collapsed state before filtering
  private originalCollapsedState = signal<boolean | null>(null);

  // Get all property rows inside this group
  private propertyRows = contentChildren(PropertyRowComponent, {
    descendants: true,
  });

  private propertiesService = inject(PropertiesService);
  private localStorageService = inject(LOCAL_STORAGE_SERVICE, { optional: true });

  private readonly STORAGE_KEY = 'property-groups-collapsed-state';

  // Computed signal to check if any rows are visible
  hasVisibleRows = computed(() => {
    const rows = this.propertyRows();
    if (rows.length === 0) {
      return true; // If no rows, show the group (for groups with other content)
    }
    return rows.some((row) => row.isVisible());
  });

  constructor() {
    // Initialize collapsed state from localStorage or default
    effect(() => {
      const id = this.groupId();
      const defaultCollapsed = this.collapsed();

      if (id) {
        const savedState = this.getCollapsedState(id);
        this._collapsed.set(
          savedState !== null ? savedState : defaultCollapsed,
        );
      } else {
        this._collapsed.set(defaultCollapsed);
      }
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
        const hasMatchingRows = rows.some((row) => row.isVisible());

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
      const newState = !this._collapsed();
      this._collapsed.set(newState);

      // Save state to localStorage
      const id = this.groupId();
      if (id) {
        this.saveCollapsedState(id, newState);
      }

      // If user manually toggles while filter is active, update the original state
      if (
        this.propertiesService.searchText() &&
        this.originalCollapsedState() !== null
      ) {
        this.originalCollapsedState.set(newState);
      }
    }
  }

  expand(): void {
    if (this._collapsed()) {
      this._collapsed.set(false);

      const id = this.groupId();
      if (id) {
        this.saveCollapsedState(id, false);
      }
    }
  }

  private getCollapsedState(groupId: string): boolean | null {
    return this.localStorageService?.getProperty<boolean>(
      this.STORAGE_KEY,
      groupId,
    ) ?? null;
  }

  private saveCollapsedState(groupId: string, collapsed: boolean): void {
    this.localStorageService?.setProperty(this.STORAGE_KEY, groupId, collapsed);
  }
}
