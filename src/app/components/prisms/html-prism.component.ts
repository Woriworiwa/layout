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
import {SerializerService} from "../../services/serializer.service";
import {CanvasStore} from "../../store/canvas.store";
import {SanitizeHtmlPipe} from "../../pipes/sanitize-html.pipe";
import {ButtonModule} from "primeng/button";
import FileSaver from 'file-saver';
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";

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

  constructor(private serializerService: SerializerService,
              private canvasStore: CanvasStore) {
    this.canvasStore.frames$
      .pipe(takeUntilDestroyed())
      .subscribe((items: CanvasItem[]) => {
        this.code = this.serializerService.serializeToHtml(items).join('\n');
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
