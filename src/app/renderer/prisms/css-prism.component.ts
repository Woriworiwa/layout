import { AfterViewChecked, ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnChanges, OnDestroy, inject, signal } from '@angular/core';

import * as Prism from 'prismjs';
import 'prismjs';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-scss';
import {CanvasItem} from "../../core/models/canvas-item.model";
import {SerializationService} from "../../core/serialization/serialization.service";
import {Subject, takeUntil} from "rxjs";
import {CanvasService} from "../../canvas/canvas.service";
import {SelectionService} from "../../canvas/selection/selection.service";
import {Highlight} from "ngx-highlightjs";
import {Button} from "primeng/button";
import {Tooltip} from "primeng/tooltip";
import FileSaver from 'file-saver';

@Component({
    selector: 'app-css-prism',
    changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Highlight, Button, Tooltip],
    template: `
    <div class="code-header">
      <span class="code-title">
        <i class="pi pi-palette"></i>
        CSS Output
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
          (onClick)="downloadCss()"
          pTooltip="Download CSS"
          tooltipPosition="bottom" />
      </div>
    </div>
    <pre class="code-block"><code language="css" [highlight]="css"></code></pre>
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
export class CssPrismComponent implements OnChanges, AfterViewChecked, OnDestroy {
  private canvasService = inject(CanvasService);
  private selectionService = inject(SelectionService);
  private cd = inject(ChangeDetectorRef);
  private serializerService = inject(SerializationService);

  @Input()
  canvasItems: CanvasItem[] = [];

  protected css = '';
  copySuccess = signal(false);
  private destroy$ = new Subject();

  ngOnChanges() {
    this.serializeToCss()

    this.canvasService.cssChanged$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.serializeToCss();
        this.cd.markForCheck();
      });

    this.selectionService.selectedItem$
      .pipe(takeUntil(this.destroy$))
      .subscribe(_ => {
        this.serializeToCss();
        this.cd.markForCheck();
      });
  }

  ngAfterViewChecked() {
    Prism.highlightAll();
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  async copyToClipboard() {
    try {
      await navigator.clipboard.writeText(this.css);
      this.copySuccess.set(true);
      setTimeout(() => this.copySuccess.set(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }

  downloadCss() {
    const blob = new Blob([this.css], {type: "text/css;charset=utf-8"});
    FileSaver.saveAs(blob, "styles.css");
  }

  private serializeToCss() {

    if (this.canvasItems) {
      this.css = this.serializerService.getSerializer("CSS-class").serialize(this.canvasItems).join('\n');
      return;
    } else {
      const selectedItem = this.selectionService.selectedItem;
      if (selectedItem) {
        this.css = this.serializerService.getSerializer("CSS-class").serialize([selectedItem]).join('\n');
      }
    }
  }
}
