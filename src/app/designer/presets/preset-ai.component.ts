import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { CanvasItem } from '../../core/models/canvas-item.model';

@Component({
  selector: 'app-preset-ai',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  template: `
    <div class="ai-preset-icon flex flex-col items-center justify-center gap-2 text-purple-600">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-8 h-8">
        <path d="M12 2L2 7l10 5 10-5-10-5z"/>
        <path d="M2 17l10 5 10-5"/>
        <path d="M2 12l10 5 10-5"/>
      </svg>
      <span class="text-[10px] font-bold uppercase tracking-wider">AI</span>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class PresetAiComponent {
  @Input() preset: CanvasItem | undefined;
}
