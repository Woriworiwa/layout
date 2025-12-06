import { Component, input, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-property-group',
  imports: [CommonModule],
  template: `
    <div class="border-b border-surface px-4">
      <div
        class="flex items-center gap-2 px-1 py-1 pl-0 cursor-pointer select-none transition-colors hover:bg-surface-hover"
        (click)="toggleCollapsed()">
        <div class="m-0 text-sm flex-1">{{ header() }}</div>
        <button
          type="button"
          class="flex items-center justify-center w-5 h-5 p-0 border-0 bg-transparent text-muted-color cursor-pointer transition-transform duration-200 shrink-0"
          [class.rotate-0]="isCollapsed()"
          [class.rotate-90]="!isCollapsed()">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M4 2L8 6L4 10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>
      <div
        class="transition-all duration-300 ease-in-out flex flex-col gap-2"
        [class.max-h-0]="isCollapsed()"
        [class.opacity-0]="isCollapsed()"
        [class.p-0]="isCollapsed()"
        [class.max-h-[2000px]]="!isCollapsed()"
        [class.opacity-100]="!isCollapsed()"
        [class.pr-3]="!isCollapsed()"
        [class.pb-3]="!isCollapsed()"
        [class.pl-3]="!isCollapsed()">
        <ng-content />
      </div>
    </div>
  `,
  styles: ``
})
export class PropertyGroupComponent {
  header = input<string>('');
  toggleable = input<boolean>(true);
  collapsed = input<boolean>(false);

  protected _collapsed = signal(false);
  protected isCollapsed = this._collapsed.asReadonly();

  constructor() {
    effect(() => {
      this._collapsed.set(this.collapsed());
    });
  }

  toggleCollapsed() {
    if (this.toggleable()) {
      this._collapsed.set(!this._collapsed());
    }
  }
}
