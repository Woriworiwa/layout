import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HtmlSerializer } from "../core/serialization/serializers/html.serializer";
import { UnsafeHtmlPipe } from "./unsafe-html.pipe";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { CanvasItem } from "../core/models/canvas-item.model";
import { DropdownModule } from "primeng/dropdown";
import { FormsModule } from "@angular/forms";
import { CanvasService } from "../shared/canvas/canvas.service";
import { AppSkeletonComponent } from "../core/app.skeleton.component";
import { SideBarComponent } from "../shared/side-bar/side-bar.component";
import { Button } from "primeng/button";
import { Tooltip } from "primeng/tooltip";
import { CssPrismComponent } from "./prisms/css-prism.component";
import { HtmlPrismComponent } from "./prisms/html-prism.component";
import { JsonPrismComponent } from "./prisms/json-prism.component";
import { ResizableDirective } from "./resizable.directive";

enum SideBarPrimary {
    BROWSER = 'browser',
    CODE = 'code'
}
enum SideBarSecondaryCode {
    CSS = 'CSS',
    HTML = 'HTML',
    JSON = 'JSON'
}
interface Tab<T> {
    title: string;
    tab: T;
    icon: string;
}
@Component({
    selector: 'app-preview',
    standalone: true,
    imports: [CommonModule, UnsafeHtmlPipe, DropdownModule, FormsModule, AppSkeletonComponent, SideBarComponent, Button, Tooltip, CssPrismComponent, HtmlPrismComponent, JsonPrismComponent, ResizableDirective],
    templateUrl: './preview.component.html',
    styleUrl: './preview.component.scss'
})
export class PreviewComponent {
    code: any;
    serializer: HtmlSerializer = new HtmlSerializer();
    selectedSideBarPrimary: SideBarPrimary = SideBarPrimary.BROWSER;
    selectedSidebarSecondary: SideBarSecondaryCode = SideBarSecondaryCode.CSS;
    width = '800px';
    tabs: Tab<SideBarPrimary>[] = [
      { title: 'Screen', tab: SideBarPrimary.BROWSER, icon: 'pi pi-desktop' },
      { title: 'Code', tab: SideBarPrimary.CODE, icon: 'pi pi-code' }
    ];
    codeTabs: Tab<SideBarSecondaryCode>[] = [
        { title: 'CSS', tab: SideBarSecondaryCode.CSS, icon: 'pi pi-plus' },
        { title: 'HTML', tab: SideBarSecondaryCode.HTML, icon: 'pi pi-comment' },
        { title: 'JSON', tab: SideBarSecondaryCode.JSON, icon: 'pi pi-code' }
    ];
    constructor(protected canvasService: CanvasService) {
        this.canvasService.items$.pipe(takeUntilDestroyed()).subscribe((items: CanvasItem[]) => {
            this.code = this.serializer.serialize(items).join('\n');
        });
    }
    onSideBarPrimaryChange($event: any) {
        this.selectedSideBarPrimary = $event.tab as unknown as SideBarPrimary;
    }

  protected readonly SideBarPrimary = SideBarPrimary;
}
