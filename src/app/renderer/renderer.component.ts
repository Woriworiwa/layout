import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HtmlSerializer } from "../core/serialization/serializers/html.serializer";
import { UnsafeHtmlPipe } from "./unsafe-html.pipe";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { CanvasItem } from "../core/models/canvas-item.model";
import { FormsModule } from "@angular/forms";
import { CanvasService } from "../canvas/canvas.service";
import { CssViewerComponent } from "../shared/code-viewer/css-viewer.component";
import { HtmlViewerComponent } from "../shared/code-viewer/html-viewer.component";
import { JsonViewerComponent } from "../shared/code-viewer/json-viewer.component";
import { ResizableDirective } from "./resizable.directive";
import { SelectButton } from "primeng/selectbutton";

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
        CssViewerComponent,
        HtmlViewerComponent,
        JsonViewerComponent,
        ResizableDirective,
        SelectButton
    ],
    templateUrl: './renderer.component.html',
    styleUrl: './renderer.component.scss'
})
export class RendererComponent {
    protected canvasService = inject(CanvasService);

    code: any;
    serializer: HtmlSerializer = new HtmlSerializer();
    selectedCodeView: CodeViewType = CodeViewType.HTML;
    width = '800px';

    codeTabs: CodeTab[] = [
        { label: 'HTML', value: CodeViewType.HTML, icon: 'pi pi-code' },
        { label: 'CSS', value: CodeViewType.CSS, icon: 'pi pi-palette' },
        { label: 'JSON', value: CodeViewType.JSON, icon: 'pi pi-file' }
    ];

    constructor() {
        this.canvasService.items$.pipe(takeUntilDestroyed()).subscribe((items: CanvasItem[]) => {
            this.code = this.serializer.serialize(items, true).join('\n');
        });
    }

    protected readonly CodeViewType = CodeViewType;
}
