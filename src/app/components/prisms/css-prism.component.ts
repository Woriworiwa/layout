import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input} from '@angular/core';
import {CommonModule} from '@angular/common';
import * as Prism from 'prismjs';
import 'prismjs';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-scss';
import {CanvasItem} from "../../models/canvas-item.model";
import {CanvasStore} from "../../store/canvas.store";
import {SerializationService} from "../../services/serialization.service";
import {Subject, takeUntil} from "rxjs";

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
export class CssPrismComponent {
  @Input()
  canvasItems: CanvasItem[] = [];

  protected css: string = '';
  private destroy$ = new Subject();

  constructor(private canvasStore: CanvasStore,
              private cd: ChangeDetectorRef,
              private serializerService: SerializationService) {
  }

  ngOnChanges() {
    this.serializeToCss()

    this.canvasStore.cssChanged$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
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
    this.css = this.serializerService.getSerializer("CSS-class").serialize(this.canvasItems).join('\n');
  }
}
