import {
  ChangeDetectionStrategy,
  Component,
  OnChanges,
  inject,
  input,
} from '@angular/core';

import { CanvasItem } from '@layout/models';
import { SerializationService } from '@layout/serialization';
import { Highlight } from 'ngx-highlightjs';
import { CopyButtonComponent } from './copy-button.component';

@Component({
  selector: 'shared-tailwind-viewer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Highlight, CopyButtonComponent],
  template: `
    <div class="header">
      <shared-copy-button [content]="tailwind" />
    </div>
    <pre><code [highlight]="tailwind" language="tailwind"></code></pre>
  `,
  styleUrl: './code-viewer-base.scss',
  styles: `
    pre[class*='language-'] {
      padding: 0.75rem 1rem;
    }
  `,
})
export class TailwindViewerComponent implements OnChanges {
  private serializerService = inject(SerializationService);

  canvasItems = input<CanvasItem[]>([]);
  protected tailwind = '';

  ngOnChanges() {
    this.serializeToCss();
  }

  private serializeToCss() {
    const separator = '\n';

    this.tailwind = this.serializerService
      .getSerializer('CSS-Tailwind')
      .serialize(this.canvasItems())
      .join(separator);
  }
}
