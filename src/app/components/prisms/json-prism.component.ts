import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SidebarModule} from "primeng/sidebar";
import {CanvasStore} from "../../store/canvas.store";
import {CanvasItem} from "../../models/canvas-item.model";
import {SerializationService} from "../../services/serialization.service";
import { Serializer } from '../../data/serializers/serializer';
import {Subject, takeUntil} from "rxjs";
import {JSONSerializer} from "../../data/serializers/JSON.serializer";

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
      background-color: #eeeeee;
      padding: 0 16px;
    }
  `
})
export class JsonPrismComponent {
  frames: CanvasItem[] | undefined = undefined;

  constructor(protected canvasStore: CanvasStore,
              private serializerService: SerializationService) {
  }

  ngOnChanges() {
    this.canvasStore.canvasItems$
      .subscribe(items => {

        //TODO: I don't know if this is a good design
        this.frames = (this.serializerService.getSerializer('JSON') as JSONSerializer).sanitizeFrames(items);
      });
  }

  ngOnInit() {
    this.frames = this.canvasStore.canvasItems;
  }
}
