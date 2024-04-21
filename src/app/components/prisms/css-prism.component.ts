import {Component, Input} from '@angular/core';
import {CommonModule} from '@angular/common';
import * as Prism from 'prismjs';
import 'prismjs';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-scss';
import {CanvasItem} from "../../models/canvas-item.model";
import {CanvasStore} from "../../store/canvas.store";
import {SerializationService} from "../../services/serialization.service";

@Component({
  selector: 'app-css-prism',
  standalone: true,
  imports: [CommonModule],
  template: `
    <pre><code class="language-scss" [innerHTML]="css"></code></pre>
  `,
  styles: `
    pre[class*="language-"] {
      padding: 1em;
      margin: 0;
    }
  `
})
export class CssPrismComponent {
  @Input()
  canvasItems: CanvasItem[] = [];

  css: string = '';

  constructor(private canvasStore: CanvasStore,
              private serializerService: SerializationService) {
  }

  ngOnChanges() {
    this.css = this.serializerService.getSerializer("CSS-class").serialize(this.canvasItems).join('\n');
  }

  ngAfterViewChecked() {
    Prism.highlightAll();
  }
}
