import { Component, inject, signal } from '@angular/core';
import { CanvasService, SelectionService } from '@layout/canvas';
import { CanvasItem } from '@layout/models';
import { FormsModule } from '@angular/forms';
import { merge } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  CssViewerComponent,
  HtmlViewerComponent,
  JsonViewerComponent,
} from '@layout/shared';

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
      .subscribe(() => {
        this.canvasItem.set(
          this.selectionService.selectedItem
            ? [this.selectionService.selectedItem]
            : [],
        );
      });
  };
}
