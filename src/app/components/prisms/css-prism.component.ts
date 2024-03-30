import {Component, Input} from '@angular/core';
import {CommonModule} from '@angular/common';
import * as Prism from 'prismjs';
import 'prismjs';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-scss';

@Component({
  selector: 'app-prism',
  standalone: true,
  imports: [CommonModule],
  template: `
    <pre><code class="language-scss" [innerHTML]="css"></code></pre>
  `,
  styles: ``
})
export class CssPrismComponent {
  @Input()
  css: string | undefined = '';

  ngAfterViewChecked() {
    Prism.highlightAll();
  }
}
