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

@Component({
  selector: 'shared-tailwind-viewer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Highlight],
  template: `
    <pre><code [highlight]="tailwind" language="tailwind"></code></pre> `,
  styles: `
    :host {
      display: block;
      height: 100%;
    }

    pre[class*='language-'] {
      padding: 0.75rem 1rem;
      margin: 0;
      height: 100%;
      background: transparent !important;
    }

    code[class*='language-'] {
      background: transparent;
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
      .getSerializer('Tailwind')
      .serialize(this.canvasItems())
      .join(separator);
  }
}
