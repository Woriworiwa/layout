import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { CanvasItem } from '@layout/models';
import { SerializationService, JSONSerializer } from '@layout/serialization';
import { Highlight } from 'ngx-highlightjs';

@Component({
  selector: 'shared-json-viewer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, Highlight],
  template: `
    <pre><code language="json" [highlight]="frames | json"></code></pre>
  `,
  styles: `
    pre[class*='language-'] {
      padding: 1em;
      margin: 0;
    }
  `,
})
export class JsonViewerComponent implements OnChanges {
  private serializerService = inject(SerializationService);

  @Input()
  canvasItems: CanvasItem[] = [];

  frames: CanvasItem[] | undefined = undefined;

  ngOnChanges() {
    this.serializeToJson();
  }

  private serializeToJson() {
    const items = Array.isArray(this.canvasItems)
      ? this.canvasItems
      : [this.canvasItems];
    this.frames = (
      this.serializerService.getSerializer('JSON') as JSONSerializer
    ).sanitizeFrames(items);
  }
}
