import {
  ChangeDetectorRef,
  Component,
  OnDestroy,
  inject,
  signal,
} from '@angular/core';

import { CssViewerComponent } from '../../shared/code-viewer/css-viewer.component';
import { HtmlViewerComponent } from '../../shared/code-viewer/html-viewer.component';
import { JsonViewerComponent } from '../../shared/code-viewer/json-viewer.component';
import { SelectionService } from '../../canvas/selection/selection.service';
import { CanvasItem } from '../../core/models/canvas-item.model';
import { CanvasService } from '../../canvas/canvas.service';
import { FormsModule } from '@angular/forms';
import { merge } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-inspector',
  imports: [
    CssViewerComponent,
    HtmlViewerComponent,
    JsonViewerComponent,
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
            : [],
        );
      });
  };
}
