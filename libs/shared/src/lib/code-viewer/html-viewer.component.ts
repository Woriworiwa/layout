import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  inject,
} from '@angular/core';

import { CanvasItem } from '@layout/models';
import { Button } from 'primeng/button';
import FileSaver from 'file-saver';
import { SerializationService, CssSerializerType } from '@layout/serialization';
import { Highlight } from 'ngx-highlightjs';

@Component({
  selector: 'shared-html-viewer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Button, Highlight],
  template: `
    @if (showDownload) {
      <div class="header">
        <p-button label="Download" (click)="downloadHtml()" size="small"></p-button>
      </div>
    }
    <pre><code [highlight]="code" language="html"></code></pre>
  `,
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      height: 100%;
    }

    .header {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 0.5rem;
      padding: 0.5rem 0.75rem;
      border-bottom: 1px solid var(--surface-border);
      background: var(--surface-50);
    }

    pre {
      flex: 1;
      margin: 0;
      border-radius: 0;
      overflow: auto;
    }

    pre[class*='language-'] {
      padding: 1em;
      margin: 0;
      height: 100%;
    }
  `,
})
export class HtmlViewerComponent implements OnChanges {
  private serializerService = inject(SerializationService);

  @Input()
  canvasItems: CanvasItem | CanvasItem[] = [];

  @Input()
  showDownload = true;

  @Input()
  includeHeaderBody = true;

  @Input()
  cssSerializerType: CssSerializerType = 'CSS-class';

  protected code = '';

  ngOnChanges() {
    this.serializeToHtml();
  }

  private serializeToHtml() {
    const items = Array.isArray(this.canvasItems)
      ? this.canvasItems
      : [this.canvasItems];
    this.code = this.serializerService
      .getSerializer('HTML')
      .serialize(items, {
        includeHeaderBody: this.includeHeaderBody,
        cssSerializerType: this.cssSerializerType,
      })
      .join('\n');
  }

  downloadHtml() {
    const blob = new Blob([this.code], { type: 'text/plain;charset=utf-8' });
    FileSaver.saveAs(blob, 'layout.html');
  }
}
