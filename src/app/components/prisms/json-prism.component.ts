import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SidebarModule} from "primeng/sidebar";
import {SerializerService} from "../../services/serializer.service";
import {CanvasStore} from "../../store/canvas.store";
import {Frame} from "../../models/frame.model";

@Component({
  selector: 'app-json-prism',
  standalone: true,
  imports: [CommonModule, SidebarModule],
  templateUrl: './json-prism.component.html',
  styleUrl: './json-prism.component.scss'
})
export class JsonPrismComponent {

  frames: Frame[] | undefined = undefined;

  constructor(private serializerService: SerializerService,
              public canvasStore: CanvasStore) {
  }

  get isActive(): boolean {
    return this.serializerService.serializerActive;
  }

  onVisibleChange(value: boolean) {
    if (!value) {
      this.serializerService.hideSerializer();
    } else {
      this.frames = this.serializerService.serializeToJSON();
    }
  }
}
