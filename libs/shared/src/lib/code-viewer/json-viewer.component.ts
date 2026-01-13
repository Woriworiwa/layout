import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  inject,
  computed,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { CanvasItem } from '@layout/models';
import { SerializationService, JSONSerializer } from '@layout/serialization';
import { Highlight } from 'ngx-highlightjs';
import { CopyButtonComponent } from './copy-button.component';

@Component({
  selector: 'shared-json-viewer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, Highlight, CopyButtonComponent],
  template: `
    <div class="header">
      <shared-copy-button [content]="jsonString()" />
    </div>
    <pre><code language="json" [highlight]="frames | json"></code></pre>
  `,
  styleUrl: './code-viewer-base.scss',
  styles: `
    pre[class*='language-'] {
      padding: 1em;
    }
  `,
})
export class JsonViewerComponent implements OnChanges {
  private serializerService = inject(SerializationService);

  @Input()
  canvasItems: CanvasItem[] = [];

  frames: CanvasItem[] | undefined = undefined;

  protected jsonString = computed(() =>
    JSON.stringify(this.frames, null, 2)
  );

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
