import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SidebarModule} from "primeng/sidebar";
import {SerializerService} from "../../services/serializer.service";
import {CanvasStore} from "../../store/canvas.store";
import {CanvasItem} from "../../models/canvas-item.model";

@Component({
  selector: 'app-json-prism',
  standalone: true,
  imports: [CommonModule, SidebarModule],
  templateUrl: './json-prism.component.html',
  styleUrl: './json-prism.component.scss'
})
export class JsonPrismComponent {

  frames: CanvasItem[] | undefined = undefined;

  constructor(private serializerService: SerializerService,
              protected canvasStore: CanvasStore) {
  }

  ngOnInit() {
    this.frames = this.canvasStore.frames;
  }
}
