import { Component, OnChanges, OnDestroy, OnInit, inject } from '@angular/core';
import {CommonModule} from '@angular/common';
import {CanvasItem} from "../../core/models/canvas-item.model";
import {SerializationService} from "../../core/serialization/serialization.service";
import {JSONSerializer} from "../../core/serialization/serializers/JSON.serializer";
import {CanvasService} from "../../shared/canvas/canvas.service";
import {Subject, takeUntil} from "rxjs";
import {Highlight} from "ngx-highlightjs";

@Component({
  selector: 'app-json-prism',
  imports: [CommonModule, Highlight],
  template: `
    <code>
      <pre><code language="json" [highlight]="frames | json"></code></pre>
      <!--      <pre><p>{{ frames | json }}</p></pre>-->
    </code>
  `,
  styles: `
    :host {
      padding: 0 16px;
    }
  `
})
export class JsonPrismComponent implements OnChanges, OnInit, OnDestroy {
  protected canvasService = inject(CanvasService);
  private serializerService = inject(SerializationService);

  frames: CanvasItem[] | undefined = undefined;

  private destroy$ = new Subject<boolean>();

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  ngOnChanges() {
    this.canvasService.items$
      .pipe(takeUntil(this.destroy$))
      .subscribe(items => {
        //TODO: I don't know if this is a good design
        this.frames = (this.serializerService.getSerializer('JSON') as JSONSerializer).sanitizeFrames(items);
      });
  }

  ngOnInit() {
    this.frames = (this.serializerService.getSerializer('JSON') as JSONSerializer).sanitizeFrames(this.canvasService.items);
  }
}
