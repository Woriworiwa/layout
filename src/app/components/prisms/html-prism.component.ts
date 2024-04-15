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
import {SanitizeHtmlPipe} from "../../pipes/sanitize-html.pipe";
import {ButtonModule} from "primeng/button";
import FileSaver from 'file-saver';
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {HtmlSerializer} from "../../data/serializers/html.serializer";

@Component({
  selector: 'app-html-prism',
  standalone: true,
  imports: [CommonModule, SanitizeHtmlPipe, ButtonModule],
  template: `
    <p-button label="Download" (click)="downloadHtml()"></p-button>
    <pre><code source class="language-html">{{ code }}</code></pre>
  `,
  styles: ``
})
export class HtmlPrismComponent {
  code: string = '';
  serializer: HtmlSerializer = new HtmlSerializer();
  constructor(private canvasStore: CanvasStore) {
    this.canvasStore.frames$
      .pipe(takeUntilDestroyed())
      .subscribe((items: CanvasItem[]) => {
        this.code = this.serializer.serialize(items).join('\n');
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
