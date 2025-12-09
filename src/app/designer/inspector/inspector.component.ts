import {
  ChangeDetectorRef,
  Component,
  OnDestroy,
  inject,
  signal,
} from '@angular/core';

import { CssPrismComponent } from '../../renderer/prisms/css-prism.component';
import { HtmlPrismComponent } from '../../renderer/prisms/html-prism.component';
import { JsonPrismComponent } from '../../renderer/prisms/json-prism.component';
import { SelectionService } from '../../canvas/selection/selection.service';
import { CanvasItem } from '../../core/models/canvas-item.model';
import { CanvasService } from '../../canvas/canvas.service';
import { FormsModule } from '@angular/forms';
import { merge } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-inspector',
  imports: [
    CssPrismComponent,
    HtmlPrismComponent,
    JsonPrismComponent,
    FormsModule,
  ],
  templateUrl: './inspector.component.html',
  styleUrls: ['./inspector.component.scss'],
  host: {
    class: 'flex flex-col h-full overflow-hidden',
  },
})
export class InspectorComponent {
  protected selectionService = inject(SelectionService);
  protected canvasService = inject(CanvasService);

  canvasItem = signal<CanvasItem[]>([]);

  constructor() {
    this.initializeInspection();
  }

  private initializeInspection = () => {
    merge(this.selectionService.selectedItem$, this.canvasService.cssChanged$)
      .pipe(takeUntilDestroyed())
      .subscribe((_) => {
        this.canvasItem.set(
          this.selectionService.selectedItem
            ? [this.selectionService.selectedItem]
            : []
        );
      });
  };
}
