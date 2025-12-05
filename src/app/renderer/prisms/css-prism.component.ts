import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnChanges, OnDestroy, inject } from '@angular/core';

import {CanvasItem} from "../../core/models/canvas-item.model";
import {SerializationService} from "../../core/serialization/serialization.service";
import {Subject, takeUntil} from "rxjs";
import {CanvasService} from "../../canvas/canvas.service";
import {SelectionService} from "../../canvas/selection/selection.service";
import {Highlight} from "ngx-highlightjs";

@Component({
    selector: 'app-css-prism',
    changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Highlight],
    template: `
      <pre><code [highlight]="css" language="css"></code></pre>
  `,
    styles: `
    pre[class*="language-"] {
      padding: 1em;
      margin: 0;
    }
  `
})
export class CssPrismComponent implements OnChanges, OnDestroy {
  private canvasService = inject(CanvasService);
  private selectionService = inject(SelectionService);
  private cd = inject(ChangeDetectorRef);
  private serializerService = inject(SerializationService);

  @Input()
  canvasItems: CanvasItem[] = [];

  protected css = '';
  private destroy$ = new Subject();

  ngOnChanges() {
    this.serializeToCss()

    this.canvasService.cssChanged$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.serializeToCss();
        this.cd.markForCheck();
      });

    this.selectionService.selectedItem$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.serializeToCss();
        this.cd.markForCheck();
      });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  private serializeToCss() {

    if (this.canvasItems) {
      this.css = this.serializerService.getSerializer("CSS-class").serialize(this.canvasItems).join('\n');
      return;
    } else {
      const selectedItem = this.selectionService.selectedItem;
      if (selectedItem) {
        this.css = this.serializerService.getSerializer("CSS-class").serialize([selectedItem]).join('\n');
      }
    }
  }
}
