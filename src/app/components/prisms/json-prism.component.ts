import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SidebarModule} from "primeng/sidebar";
import {CanvasStore} from "../../store/canvas.store";
import {CanvasItem} from "../../models/canvas-item.model";

@Component({
  selector: 'app-json-prism',
  standalone: true,
  imports: [CommonModule, SidebarModule],
  template: `
    <code>
      <pre><p>{{ canvasStore.canvasItems$ | async | json }}</p></pre>
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

  constructor(protected canvasStore: CanvasStore) {
  }

  ngOnInit() {
    this.frames = this.canvasStore.canvasItems;
  }
}
