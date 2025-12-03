import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HtmlSerializer } from "../core/serialization/serializers/html.serializer";
import { UnsafeHtmlPipe } from "./unsafe-html.pipe";
import { takeUntilDestroyed, toSignal } from "@angular/core/rxjs-interop";
import { FormsModule } from "@angular/forms";
import { CanvasService } from "../canvas/canvas.service";
import { CssPrismComponent } from "./prisms/css-prism.component";
import { HtmlPrismComponent } from "./prisms/html-prism.component";
import { JsonPrismComponent } from "./prisms/json-prism.component";
import { Button } from "primeng/button";
import { Tooltip } from "primeng/tooltip";

enum CodeViewType {
    HTML = 'HTML',
    CSS = 'CSS',
    JSON = 'JSON'
}

interface CodeTab {
    label: string;
    value: CodeViewType;
    icon: string;
}

@Component({
    selector: 'app-preview',
    standalone: true,
    imports: [
        CommonModule,
        UnsafeHtmlPipe,
        FormsModule,
        CssPrismComponent,
        HtmlPrismComponent,
        JsonPrismComponent,
        Button,
        Tooltip
    ],
    templateUrl: './renderer.component.html',
    styleUrl: './renderer.component.scss'
})
export class RendererComponent {
    private canvasService = inject(CanvasService);
    private serializer = new HtmlSerializer();

    // Signals for reactive state management
    items = toSignal(this.canvasService.items$, { initialValue: [] });
    selectedCodeView = signal<CodeViewType>(CodeViewType.HTML);
    isFullscreen = signal(false);
    previewScale = signal(100);

    // Computed HTML code
    code = computed(() => this.serializer.serialize(this.items()).join('\n'));

    codeTabs: CodeTab[] = [
        { label: 'HTML', value: CodeViewType.HTML, icon: 'pi pi-code' },
        { label: 'CSS', value: CodeViewType.CSS, icon: 'pi pi-palette' },
        { label: 'JSON', value: CodeViewType.JSON, icon: 'pi pi-file' }
    ];

    protected readonly CodeViewType = CodeViewType;

    selectTab(tab: CodeViewType) {
        this.selectedCodeView.set(tab);
    }

    toggleFullscreen() {
        this.isFullscreen.update(v => !v);
    }

    zoomIn() {
        this.previewScale.update(scale => Math.min(scale + 10, 200));
    }

    zoomOut() {
        this.previewScale.update(scale => Math.max(scale - 10, 50));
    }

    resetZoom() {
        this.previewScale.set(100);
    }

    refresh() {
        // Force refresh by triggering change detection
        this.selectedCodeView.update(v => v);
    }
}
