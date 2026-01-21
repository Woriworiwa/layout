import { Component, inject, signal, computed, effect } from '@angular/core';
import { HtmlSerializer } from '@layout/serialization';
import { UnsafeHtmlPipe } from '../unsafe-html.pipe';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CanvasItem } from '@layout/models';
import { FormsModule } from '@angular/forms';
import { CanvasService } from '@layout/canvas';
import { SelectButton } from 'primeng/selectbutton';
import { ResizableDirective } from '../resizable.directive';
import { PreviewThemeService } from '../preview-theme.service';

interface ViewportPreset {
  label: string;
  value: string;
  width?: number;
}

/** Tailwind CSS CDN script tag for utility classes in preview */
const tailwindCdn = `<script src="https://cdn.tailwindcss.com"></script>`;

@Component({
  selector: 'app-preview',
  imports: [UnsafeHtmlPipe, FormsModule, SelectButton, ResizableDirective],
  templateUrl: './renderer.component.html',
  styleUrl: './renderer.component.scss',
})
export class RendererComponent {
  protected canvasService = inject(CanvasService);
  protected previewThemeService = inject(PreviewThemeService);

  code = signal<string>('');
  serializer: HtmlSerializer = new HtmlSerializer();
  selectedViewport = signal<string>('tablet');
  customWidth = signal<number>(768);

  // Store current items for re-rendering on theme change
  private currentItems = signal<CanvasItem[]>([]);

  // Viewport presets
  viewportPresets: ViewportPreset[] = [
    { label: 'Mobile', value: 'mobile', width: 375 },
    { label: 'Tablet', value: 'tablet', width: 768 },
    { label: 'Desktop', value: 'desktop', width: 1440 },
    { label: 'Custom', value: 'custom' },
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
        this.currentItems.set(items);
        this.regenerateCode();
      });

    // Reset to tablet width when custom is selected
    effect(() => {
      if (this.selectedViewport() === 'custom') {
        this.customWidth.set(768);
      }
    });

    // Regenerate code when theme changes
    effect(() => {
      // Access the signal to track changes
      this.previewThemeService.selectedThemeId();
      this.regenerateCode();
    });
  }

  private regenerateCode(): void {
    const items = this.currentItems();
    if (items.length === 0) {
      this.code.set('');
      return;
    }
    const html = this.serializer
      .serialize(items, { includeHeaderBody: true })
      .join('\n');
    this.code.set(this.injectAllStyles(html));
  }

  private injectAllStyles(html: string): string {
    const themeStyles = this.previewThemeService.generateThemeStyles();
    const injection = `${tailwindCdn}
<style>${themeStyles}</style>
  </head>`;
    return html.replace('</head>', injection);
  }

  onThemeChange(themeId: string): void {
    this.previewThemeService.selectTheme(themeId);
  }

  updateCustomWidth(): void {
    // Ensure width is within bounds
    const width = this.customWidth();
    if (width < 320) {
      this.customWidth.set(320);
    } else if (width > 2560) {
      this.customWidth.set(2560);
    }
  }
}
