import { ChangeDetectionStrategy, Component, Input, OnChanges, inject } from '@angular/core';

import {CanvasItem} from "../../core/models/canvas-item.model";
import {Button} from "primeng/button";
import FileSaver from 'file-saver';
import {SerializationService} from "../../core/serialization/serialization.service";
import {Highlight} from "ngx-highlightjs";

@Component({
  selector: 'app-html-prism',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Button, Highlight],
  template: `
    @if (showDownload) {
      <p-button label="Download" (click)="downloadHtml()"></p-button>
    }
    <pre><code [highlight]="code" language="html"></code></pre>
  `,
  styles: `
    :host {
      display: block;
      position: relative;

      p-button {
        position: absolute;
        right: 0;
        margin-right: 10px;
        margin-top: 20px;
      }

      pre {
        margin: 0;
        border-radius: 0;
      }
    }

    pre[class*="language-"] {
      padding: 1em;
      margin: 0;
    }
  `
})
export class HtmlViewerComponent implements OnChanges {
  private serializerService = inject(SerializationService);

  @Input()
  canvasItems: CanvasItem | CanvasItem[] = [];

  @Input()
  showDownload = true;

  code = '';

  ngOnChanges() {
    this.serializeToHtml();
  }

  private serializeToHtml() {
    const items = Array.isArray(this.canvasItems) ? this.canvasItems : [this.canvasItems];
    this.code = this.serializerService.getSerializer("HTML").serialize(items).join('\n');
  }

  downloadHtml() {
    const blob = new Blob([this.code], {type: "text/plain;charset=utf-8"});
    FileSaver.saveAs(blob, "layout.html");
  }
}
