import { Component, OnChanges, OnDestroy, OnInit, inject, signal } from '@angular/core';
import {CommonModule} from '@angular/common';
import {CanvasItem} from "../../core/models/canvas-item.model";
import {SerializationService} from "../../core/serialization/serialization.service";
import {JSONSerializer} from "../../core/serialization/serializers/JSON.serializer";
import {CanvasService} from "../../canvas/canvas.service";
import {Subject, takeUntil} from "rxjs";
import {Highlight} from "ngx-highlightjs";
import {Button} from "primeng/button";
import {Tooltip} from "primeng/tooltip";
import FileSaver from 'file-saver';

@Component({
  selector: 'app-json-prism',
  imports: [CommonModule, Highlight, Button, Tooltip],
  template: `
    <div class="code-header">
      <span class="code-title">
        <i class="pi pi-file"></i>
        JSON Output
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
          (onClick)="downloadJson()"
          pTooltip="Download JSON"
          tooltipPosition="bottom" />
      </div>
    </div>
    <pre class="code-block"><code language="json" [highlight]="frames | json"></code></pre>
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
export class JsonPrismComponent implements OnChanges, OnInit, OnDestroy {
  protected canvasService = inject(CanvasService);
  private serializerService = inject(SerializationService);

  frames: CanvasItem[] | undefined = undefined;
  copySuccess = signal(false);

  private destroy$ = new Subject<boolean>();

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  ngOnChanges() {
    this.canvasService.items$
      .pipe(takeUntil(this.destroy$))
      .subscribe(items => {
        this.frames = (this.serializerService.getSerializer('JSON') as JSONSerializer).sanitizeFrames(items);
      });
  }

  ngOnInit() {
    this.frames = (this.serializerService.getSerializer('JSON') as JSONSerializer).sanitizeFrames(this.canvasService.items);
  }

  async copyToClipboard() {
    try {
      const jsonString = JSON.stringify(this.frames, null, 2);
      await navigator.clipboard.writeText(jsonString);
      this.copySuccess.set(true);
      setTimeout(() => this.copySuccess.set(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }

  downloadJson() {
    const jsonString = JSON.stringify(this.frames, null, 2);
    const blob = new Blob([jsonString], {type: "application/json;charset=utf-8"});
    FileSaver.saveAs(blob, "layout.json");
  }
}
