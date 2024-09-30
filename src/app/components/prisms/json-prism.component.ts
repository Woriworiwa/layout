import {Component, OnChanges, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import {SidebarModule} from "primeng/sidebar";
import {CanvasItem} from "../../models/canvas-item.model";
import {SerializationService} from "../../services/serialization.service";
import {JSONSerializer} from "../../data/serializers/JSON.serializer";
import {CanvasService} from "../../services/canvas.service";

@Component({
  selector: 'app-json-prism',
  standalone: true,
  imports: [CommonModule, SidebarModule],
  template: `
    <code>
      <pre><p>{{ frames | json }}</p></pre>
    </code>
  `,
  styles: `
    :host{
      padding: 0 16px;
    }
  `
})
export class JsonPrismComponent implements OnChanges, OnInit {
  frames: CanvasItem[] | undefined = undefined;

  constructor(protected canvasService: CanvasService,
              private serializerService: SerializationService) {
  }

  ngOnChanges() {
    this.canvasService.items$
      .subscribe(items => {

        //TODO: I don't know if this is a good design
        this.frames = (this.serializerService.getSerializer('JSON') as JSONSerializer).sanitizeFrames(items);
      });
  }

  ngOnInit() {
    this.frames = this.canvasService.items;
  }
}
