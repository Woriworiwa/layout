import { AfterViewChecked, ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnChanges, OnDestroy, inject } from '@angular/core';

import * as Prism from 'prismjs';
import 'prismjs';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-scss';
import {CanvasItem} from "../../core/models/canvas-item.model";
import {SerializationService} from "../../core/serialization/serialization.service";
import {Subject, takeUntil} from "rxjs";
import {CanvasService} from "../../shared/canvas/canvas.service";
import {SelectionService} from "../../shared/canvas/selection/selection.service";
import {Highlight} from "ngx-highlightjs";

@Component({
    selector: 'app-css-prism',
    changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Highlight],
    template: `
      <pre><code language="css" [highlight]="css"></code></pre>
  `,
    styles: `
    pre[class*="language-"] {
      padding: 1em;
      margin: 0;
    }
  `
})
export class CssPrismComponent implements OnChanges, AfterViewChecked, OnDestroy {
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
      .subscribe(_ => {
        this.serializeToCss();
        this.cd.markForCheck();
      });
  }

  ngAfterViewChecked() {
    Prism.highlightAll();
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
