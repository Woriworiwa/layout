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
import {CssClassSerializer} from "../../data/serializers/css-class.serializer";
import {CssStyleSerializer} from "../../data/serializers/css-style.serializer";
import {Serializer} from "../../data/serializers/serializer";

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
  serializer: Serializer = new CssClassSerializer();

  constructor(private canvasStore: CanvasStore) {
  }

  ngOnChanges() {
    this.css = this.serializer.serialize(this.canvasItems).join('\n');
  }

  ngAfterViewChecked() {
    Prism.highlightAll();
  }
}
