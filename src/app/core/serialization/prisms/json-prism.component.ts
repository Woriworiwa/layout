import {Component, OnChanges, OnDestroy, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SidebarModule} from "primeng/sidebar";
import {CanvasItem} from "../../models/canvas-item.model";
import {SerializationService} from "../serialization.service";
import {JSONSerializer} from "../serializers/JSON.serializer";
import {CanvasService} from "../../../shared/canvas/canvas.service";
import {Subject, takeUntil} from "rxjs";
import {Highlight} from "ngx-highlightjs";

@Component({
  selector: 'app-json-prism',
  imports: [CommonModule, SidebarModule, Highlight],
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
  frames: CanvasItem[] | undefined = undefined;

  private destroy$ = new Subject<boolean>();

  constructor(protected canvasService: CanvasService,
              private serializerService: SerializationService) {
  }

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
