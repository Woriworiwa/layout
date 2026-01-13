import { Component, inject, signal } from '@angular/core';
import { CanvasService, SelectionService } from '@layout/canvas';
import { CanvasItem } from '@layout/models';
import { FormsModule } from '@angular/forms';
import { merge } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  CssViewerComponent, HtmlViewerComponent,
  JsonViewerComponent, TailwindViewerComponent,
} from '@layout/shared';
import { CssSerializerType } from '@layout/serialization';
import { SelectButton } from 'primeng/selectbutton';

@Component({
  selector: 'app-inspector',
  imports: [
    CssViewerComponent,
    JsonViewerComponent,
    FormsModule,
    TailwindViewerComponent,
    HtmlViewerComponent,
    SelectButton,
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

  protected canvasItem = signal<CanvasItem[]>([]);
  protected selectedCssSerializer = signal<CssSerializerType>('CSS-Tailwind');

  protected cssSerializerOptions = [
    { label: 'Tailwind', value: 'CSS-Tailwind' as CssSerializerType },
    { label: 'Class', value: 'CSS-class' as CssSerializerType },
    { label: 'Style', value: 'CSS-style' as CssSerializerType },
  ];

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
