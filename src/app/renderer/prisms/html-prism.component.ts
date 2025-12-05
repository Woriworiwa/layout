import { Component, inject } from '@angular/core';

import {CanvasItem} from "../../core/models/canvas-item.model";
import {Button} from "primeng/button";
import FileSaver from 'file-saver';
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {SerializationService} from "../../core/serialization/serialization.service";
import {CanvasService} from "../../canvas/canvas.service";
import {Highlight} from "ngx-highlightjs";

@Component({
    selector: 'app-html-prism',
  imports: [Button, Highlight],
    template: `
    <p-button label="Download" (click)="downloadHtml()"></p-button>
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
  `
})
export class HtmlPrismComponent {
  private canvasService = inject(CanvasService);
  private serializerService = inject(SerializationService);

  code = '';

  constructor() {
    this.canvasService.items$
      .pipe(takeUntilDestroyed())
      .subscribe((items: CanvasItem[]) => {
        this.code = this.serializerService.getSerializer("HTML").serialize(items).join('\n');
      });
  }

  downloadHtml() {
    const blob = new Blob([this.code], {type: "text/plain;charset=utf-8"});
    FileSaver.saveAs(blob, "hello world.html");
  }
}
