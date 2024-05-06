import {Component, Input} from '@angular/core';
import {CommonModule} from '@angular/common';
import * as Prism from 'prismjs';
import 'prismjs';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-scss';
import 'prismjs/components/prism-markup';
import {CanvasItem} from "../../models/canvas-item.model";
import {CanvasStore} from "../../store/canvas.store";
import {UnsafeHtmlPipe} from "../../pipes/unsafe-html.pipe";
import {ButtonModule} from "primeng/button";
import FileSaver from 'file-saver';
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {SerializationService} from "../../services/serialization.service";

@Component({
  selector: 'app-html-prism',
  standalone: true,
  imports: [CommonModule, UnsafeHtmlPipe, ButtonModule],
  template: `
    <p-button label="Download" (click)="downloadHtml()"></p-button>
    <pre><code source class="language-html">{{ code }}</code></pre>
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
        background-color: #eeeeee;
        border-radius: 0;
      }
    }
  `
})
export class HtmlPrismComponent {
  code: string = '';

  constructor(private canvasStore: CanvasStore,
              private serializerService: SerializationService) {
    this.canvasStore.canvasItems$
      .pipe(takeUntilDestroyed())
      .subscribe((items: CanvasItem[]) => {
        this.code = this.serializerService.getSerializer("HTML").serialize(items).join('\n');
      });
  }

  ngAfterViewChecked() {
    Prism.highlightAll();
  }

  downloadHtml() {
    const blob = new Blob([this.code], {type: "text/plain;charset=utf-8"});
    FileSaver.saveAs(blob, "hello world.html");
  }
}
