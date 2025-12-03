import { AfterViewChecked, Component, inject, signal } from '@angular/core';

import * as Prism from 'prismjs';
import 'prismjs';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-scss';
import 'prismjs/components/prism-markup';
import {CanvasItem} from "../../core/models/canvas-item.model";
import {Button} from "primeng/button";
import FileSaver from 'file-saver';
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {SerializationService} from "../../core/serialization/serialization.service";
import {CanvasService} from "../../canvas/canvas.service";
import {Highlight} from "ngx-highlightjs";
import {Tooltip} from "primeng/tooltip";

@Component({
    selector: 'app-html-prism',
  imports: [Button, Highlight, Tooltip],
    template: `
    <div class="code-header">
      <span class="code-title">
        <i class="pi pi-code"></i>
        HTML Output
      </span>
      <div class="code-actions">
        <p-button
          icon="pi pi-copy"
          [text]="true"
          [rounded]="true"
          size="small"
          [severity]="copySuccess() ? 'success' : 'secondary'"
          (onClick)="copyToClipboard()"
          [pTooltip]="copySuccess() ? 'Copied!' : 'Copy to Clipboard'"
          tooltipPosition="bottom" />
        <p-button
          icon="pi pi-download"
          [text]="true"
          [rounded]="true"
          size="small"
          severity="secondary"
          (onClick)="downloadHtml()"
          pTooltip="Download HTML"
          tooltipPosition="bottom" />
      </div>
    </div>
    <pre class="code-block"><code language="html" [highlight]="code"></code></pre>
  `,
    styles: `
    :host {
      display: block;
      height: 100%;
      display: flex;
      flex-direction: column;
    }

    .code-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.75rem 1rem;
      background-color: var(--p-surface-50);
      border-bottom: 1px solid var(--p-surface-200);
      flex-shrink: 0;
    }

    .code-title {
      font-size: 0.875rem;
      font-weight: 600;
      color: var(--p-surface-700);
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .code-actions {
      display: flex;
      align-items: center;
      gap: 0.25rem;
    }

    .code-block {
      flex: 1;
      overflow: auto;
      margin: 0;
      font-size: 0.75rem;

      code {
        display: block;
        min-height: 100%;
      }
    }
  `
})
export class HtmlPrismComponent implements AfterViewChecked {
  private canvasService = inject(CanvasService);
  private serializerService = inject(SerializationService);

  code = '';
  copySuccess = signal(false);

  constructor() {
    this.canvasService.items$
      .pipe(takeUntilDestroyed())
      .subscribe((items: CanvasItem[]) => {
        this.code = this.serializerService.getSerializer("HTML").serialize(items).join('\n');
      });
  }

  ngAfterViewChecked() {
    Prism.highlightAll();
  }

  async copyToClipboard() {
    try {
      await navigator.clipboard.writeText(this.code);
      this.copySuccess.set(true);
      setTimeout(() => this.copySuccess.set(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }

  downloadHtml() {
    const blob = new Blob([this.code], {type: "text/html;charset=utf-8"});
    FileSaver.saveAs(blob, "layout.html");
  }
}
