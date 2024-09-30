import {
  AfterViewChecked,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  OnDestroy
} from '@angular/core';
import {CommonModule} from '@angular/common';
import * as Prism from 'prismjs';
import 'prismjs';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-scss';
import {CanvasItem} from "../../models/canvas-item.model";
import {SerializationService} from "../../services/serialization.service";
import {Subject, takeUntil} from "rxjs";
import {CanvasService} from "../../services/canvas.service";
import {SelectionService} from "../../services/selection.service";

@Component({
  selector: 'app-css-prism',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  template: `
    <pre><code class="language-scss" [innerHTML]="css"></code></pre>
  `,
  styles: `
    pre[class*="language-"] {
      padding: 1em;
      margin: 0;
    }
  `
})
export class CssPrismComponent implements OnChanges, AfterViewChecked, OnDestroy{
  @Input()
  canvasItems: CanvasItem[] = [];

  protected css = '';
  private destroy$ = new Subject();

  constructor(private canvasService: CanvasService,
              private selectionService: SelectionService,
              private cd: ChangeDetectorRef,
              private serializerService: SerializationService) {
  }

  ngOnChanges() {
    this.serializeToCss()

    this.canvasService.cssChanged$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.serializeToCss();
        this.cd.markForCheck();
      });

    this.selectionService.selectedItem$
      .subscribe(frame => {
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
