import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HtmlSerializer } from "../core/serialization/serializers/html.serializer";
import { UnsafeHtmlPipe } from "./unsafe-html.pipe";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { CanvasItem } from "../core/models/canvas-item.model";
import { FormsModule } from "@angular/forms";
import { CanvasService } from "../canvas/canvas.service";
import { CssPrismComponent } from "./prisms/css-prism.component";
import { HtmlPrismComponent } from "./prisms/html-prism.component";
import { JsonPrismComponent } from "./prisms/json-prism.component";
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
        CssPrismComponent,
        HtmlPrismComponent,
        JsonPrismComponent,
        ResizableDirective,
        SelectButton
    ],
    templateUrl: './preview.component.html',
    styleUrl: './preview.component.scss'
})
export class PreviewComponent {
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
            this.code = this.serializer.serialize(items).join('\n');
        });
    }

    protected readonly CodeViewType = CodeViewType;
}
