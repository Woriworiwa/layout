import {Component, Input} from '@angular/core';
import {CommonModule} from '@angular/common';
import * as Prism from 'prismjs';
import 'prismjs';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-scss';
import {CanvasItem} from "../../models/canvas-item.model";
import {SerializerService} from "../../services/serializer.service";
import {CanvasStore} from "../../store/canvas.store";

@Component({
  selector: 'app-css-prism',
  standalone: true,
  imports: [CommonModule],
  template: `
    <pre><code class="language-scss" [innerHTML]="css"></code></pre>
  `,
  styles: ``
})
export class CssPrismComponent {
  @Input()
  canvasItems: CanvasItem[] = [];

  css: string = '';

  constructor(private serializerService: SerializerService,
              private canvasStore: CanvasStore) {
  }

  ngOnChanges() {
    this.css = this.serializerService.serializeToCssClasses(this.canvasItems).join('\n');
  }

  ngAfterViewChecked() {
    Prism.highlightAll();
  }
}
