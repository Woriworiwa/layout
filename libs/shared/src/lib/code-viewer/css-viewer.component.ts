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
import { CopyButtonComponent } from './copy-button.component';

@Component({
  selector: 'shared-css-viewer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Highlight, CopyButtonComponent],
  template: `
    <div class="header">
      <shared-copy-button [content]="css" />
    </div>
    <pre><code [highlight]="css" language="css"></code></pre>
  `,
  styleUrl: './code-viewer-base.scss',
  styles: `
    pre[class*='language-'] {
      padding: 0.75rem 1rem;
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
    } else if (serializerType === 'CSS-Tailwind') {
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
