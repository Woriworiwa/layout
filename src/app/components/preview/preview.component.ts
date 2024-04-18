import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {HtmlSerializer} from "../../data/serializers/html.serializer";
import {CanvasStore} from "../../store/canvas.store";
import {UnsafeHtmlPipe} from "../../pipes/unsafe-html.pipe";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {CanvasItem} from "../../models/canvas-item.model";

@Component({
  selector: 'app-preview',
  standalone: true,
  imports: [CommonModule, UnsafeHtmlPipe],
  template: `<iframe [srcdoc]="code | unsafeHtml" style="width: 100%; height: 600px;"></iframe>`,
  styles: ``
})
export class PreviewComponent {
  code: any;
  serializer: HtmlSerializer = new HtmlSerializer();

  constructor(private canvasStore: CanvasStore) {
    this.canvasStore.frames$
      .pipe(takeUntilDestroyed())
      .subscribe((items: CanvasItem[]) => {
        this.code = this.serializer.serialize(items).join('\n');
      });
  }
}
