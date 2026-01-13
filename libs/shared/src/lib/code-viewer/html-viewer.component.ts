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
import { Tooltip } from 'primeng/tooltip';
import { CopyButtonComponent } from './copy-button.component';

@Component({
  selector: 'shared-html-viewer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Button, Highlight, Tooltip, CopyButtonComponent],
  template: `
    <div class="header">
      <shared-copy-button [content]="code" />
      @if (showDownload) {
        <p-button
          icon="pi pi-download"
          (onClick)="downloadHtml()"
          pTooltip="Download"
          severity="secondary"
          [text]="true"
          size="small"
        />
      }
    </div>
    <pre><code [highlight]="code" language="html"></code></pre>
  `,
  styleUrl: './code-viewer-base.scss',
  styles: `
    pre[class*='language-'] {
      padding: 1em;
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
