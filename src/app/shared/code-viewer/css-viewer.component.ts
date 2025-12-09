import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  inject,
  input,
} from '@angular/core';

import {CanvasItem} from "../../core/models/canvas-item.model";
import {SerializationService} from "../../core/serialization/serialization.service";
import {Highlight} from "ngx-highlightjs";

@Component({
  selector: 'app-css-prism',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Highlight],
  template: `
    <pre><code [highlight]="css" language="css"></code></pre>
  `,
  styles: `
    pre[class*="language-"] {
      padding: 1em;
      margin: 0;
    }
  `
})
export class CssViewerComponent implements OnChanges {
  private serializerService = inject(SerializationService);

  canvasItems = input<CanvasItem[]>([]);

  protected css = '';

  ngOnChanges() {
    this.serializeToCss();
  }

  private serializeToCss() {
    this.css = this.serializerService.getSerializer("CSS-class").serialize(this.canvasItems()).join('\n');
  }
}
