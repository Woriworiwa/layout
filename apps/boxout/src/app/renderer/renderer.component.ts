import { Component, inject, signal, computed, effect } from '@angular/core';
import { HtmlSerializer } from '@layout/serialization';
import { UnsafeHtmlPipe } from './unsafe-html.pipe';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CanvasItem } from '@layout/models';
import { FormsModule } from '@angular/forms';
import { CanvasService } from '@layout/canvas';
import { SelectButton } from 'primeng/selectbutton';
import { Button } from 'primeng/button';
import { Tooltip } from 'primeng/tooltip';
import { ResizableDirective } from './resizable.directive';
import { CssViewerComponent, HtmlViewerComponent, JsonViewerComponent } from '@layout/shared';

enum CodeViewType {
  HTML = 'HTML',
  CSS = 'CSS',
  JSON = 'JSON',
}

interface CodeTab {
  label: string;
  value: CodeViewType;
}

interface ViewportPreset {
  label: string;
  value: string;
  width?: number;
}

@Component({
  selector: 'app-preview',
  standalone: true,
  imports: [
    UnsafeHtmlPipe,
    FormsModule,
    SelectButton,
    Button,
    Tooltip,
    ResizableDirective,
    HtmlViewerComponent,
    CssViewerComponent,
    JsonViewerComponent,
  ],
  templateUrl: './renderer.component.html',
  styleUrl: './renderer.component.scss',
})
export class RendererComponent {
  protected canvasService = inject(CanvasService);

  code = signal<string>('');
  serializer: HtmlSerializer = new HtmlSerializer();
  selectedCodeView: CodeViewType = CodeViewType.HTML;
  codePanelVisible = signal(false);
  selectedViewport = signal<string>('tablet');
  customWidth = signal<number>(768);

  // Viewport components-panel
  viewportPresets: ViewportPreset[] = [
    { label: 'Mobile', value: 'mobile', width: 375 },
    { label: 'Tablet', value: 'tablet', width: 768 },
    { label: 'Desktop', value: 'desktop', width: 1440 },
    { label: 'Custom', value: 'custom' },
  ];

  codeTabs: CodeTab[] = [
    { label: 'HTML', value: CodeViewType.HTML },
    { label: 'CSS', value: CodeViewType.CSS },
    { label: 'JSON', value: CodeViewType.JSON },
  ];

  // Computed width based on selected viewport
  previewWidth = computed(() => {
    const viewport = this.selectedViewport();
    if (viewport === 'custom') {
      return `${this.customWidth()}px`;
    }
    const preset = this.viewportPresets.find((p) => p.value === viewport);
    return preset?.width ? `${preset.width}px` : '100%';
  });

  currentWidth = computed(() => {
    const viewport = this.selectedViewport();
    if (viewport === 'custom') {
      return `${this.customWidth()}px`;
    }
    const preset = this.viewportPresets.find((p) => p.value === viewport);
    return preset?.width ? `${preset.width}px` : 'Full Width';
  });

  constructor() {
    this.canvasService.items$
      .pipe(takeUntilDestroyed())
      .subscribe((items: CanvasItem[]) => {
        this.code.set(this.serializer.serialize(items, true).join('\n'));
      });

    // Reset to tablet width when custom is selected
    effect(() => {
      if (this.selectedViewport() === 'custom') {
        this.customWidth.set(768);
      }
    });
  }

  toggleCodePanel() {
    this.codePanelVisible.update((v) => !v);
  }

  updateCustomWidth() {
    // Ensure width is within bounds
    const width = this.customWidth();
    if (width < 320) {
      this.customWidth.set(320);
    } else if (width > 2560) {
      this.customWidth.set(2560);
    }
  }

  protected readonly CodeViewType = CodeViewType;
}
