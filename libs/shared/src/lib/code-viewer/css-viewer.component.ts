import {
  ChangeDetectionStrategy,
  Component,
  OnChanges,
  inject,
  input,
} from '@angular/core';

import { CanvasItem } from '@layout/models';
import { SerializationService, SerializerType } from '@layout/serialization';
import { Highlight } from 'ngx-highlightjs';

@Component({
  selector: 'shared-css-viewer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Highlight],
  template: ` <pre><code [highlight]="css" language="css"></code></pre> `,
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
export class CssViewerComponent implements OnChanges {
  private serializerService = inject(SerializationService);

  canvasItems = input<CanvasItem[]>([]);
  serializerType = input<SerializerType>('CSS-class');
  protected css = '';

  ngOnChanges() {
    this.serializeToCss();
  }

  private serializeToCss() {
    const serializerType = this.serializerType();
    let separator: string;

    if (serializerType === 'CSS-class') {
      separator = '\n';
    } else if (serializerType === 'Tailwind') {
      separator = '\n';
    } else {
      separator = ';\n';
    }

    this.css = this.serializerService
      .getSerializer(serializerType)
      .serialize(this.canvasItems())
      .join(separator);
  }
}
