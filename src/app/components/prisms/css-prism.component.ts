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
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";
import {SanitizeHtmlPipe} from "../../pipes/sanitize-html.pipe";

@Component({
  selector: 'app-css-prism',
  standalone: true,
  imports: [CommonModule, SanitizeHtmlPipe],
  template: `
    <pre><code source [class]="mode === 'CSS' ? 'language-scss' : 'language-html'">{{ code }}</code></pre>
  `,
  styles: ``
})
export class CssPrismComponent {
  @Input()
  canvasItems: CanvasItem[] = [];

  @Input()
  mode: 'CSS' | 'HTML' = 'CSS';

  code: string = '';

  constructor(private serializerService: SerializerService,
              private domSanitizer:DomSanitizer) {
  }

  ngOnChanges() {
    if (this.mode === 'CSS') {
      this.code = this.serializerService.serializeToCssClasses(this.canvasItems).join('\n');
    }else {
      this.code = this.serializerService.serializeToHtml(this.canvasItems).join('\n');
    }
  }

  ngAfterViewChecked() {
    Prism.highlightAll();
  }
}
