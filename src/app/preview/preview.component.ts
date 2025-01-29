import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HtmlSerializer} from "../core/serialization/serializers/html.serializer";
import {UnsafeHtmlPipe} from "./unsafe-html.pipe";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {CanvasItem} from "../core/models/canvas-item.model";
import {DropdownModule} from "primeng/dropdown";
import {FormsModule} from "@angular/forms";
import {CanvasService} from "../shared/canvas/canvas.service";
import {AppSkeletonComponent} from "../app.skeleton.component";
import {SideBarComponent} from "../designer/side-bar/side-bar.component";
import {Button} from "primeng/button";
import {Tooltip} from "primeng/tooltip";
import {AppStateService} from "../core/services/app-state.service";
import {CssPrismComponent} from "../core/serialization/prisms/css-prism.component";
import {HtmlPrismComponent} from "../core/serialization/prisms/html-prism.component";
import {JsonPrismComponent} from "../core/serialization/prisms/json-prism.component";

type SideBarPrimary = 'browser' | 'code';
type SideBarSecondaryCode = 'CSS' | 'HTML' | 'JSON';

@Component({
    selector: 'app-preview',
  imports: [CommonModule, UnsafeHtmlPipe, DropdownModule, FormsModule, AppSkeletonComponent, SideBarComponent, Button, Tooltip, CssPrismComponent, HtmlPrismComponent, JsonPrismComponent],
    templateUrl: './preview.component.html',
    styleUrl: './preview.component.scss'
})
export class PreviewComponent {
  code: any;
  serializer: HtmlSerializer = new HtmlSerializer();
  selectedSideBarPrimary: SideBarPrimary | undefined;
  selectedResolution: { name: string, width: string } | undefined;

  mediaQueries: { name: string, width: string }[] = [{
    name: 'auto',
    width: '100%',
  }, {
    name: 'Desktops (1920)',
    width: '1920px'
  }, {
    name: 'Desktops (1280)',
    width: '1280px',
  }, {
    name: 'Tablets, Ipads (1024px)',
    width: '1024px',
  }, {
    name: 'Mobiles, Ipads (767px)',
    width: '767px',
  }, {
    name: 'Small mobiles (480px)',
    width: '480px',
  }
  ];

  tabs: {title: string, tab: SideBarPrimary, icon: string}[] = [
    { title: 'Screen', tab: 'browser', icon: 'pi pi-minus' },
    { title: 'Code', tab: 'code', icon: 'pi pi-code' }
  ];

  codeTabs: {title: string, tab: SideBarSecondaryCode, icon: string}[] = [
    { title: 'CSS', tab: 'CSS', icon: 'pi pi-plus' },
    { title: 'HTML', tab: 'HTML', icon: 'pi pi-comment' },
    { title: 'JSON', tab: 'JSON', icon: 'pi pi-code' },
  ];

  protected selectedMediaQuery: { name: string, width: string } | undefined = this.mediaQueries[this.mediaQueries.findIndex((mq: { name: string, width: string }) => mq.name === 'Tablets, Ipads (1024px)')];
  selectedSidebarSecondary?: 'CSS' | 'HTML' | 'JSON' = 'CSS';

  constructor(protected canvasService: CanvasService,
              protected appStateService: AppStateService) {

    this.canvasService.items$
      .pipe(takeUntilDestroyed())
      .subscribe((items: CanvasItem[]) => {
        this.code = this.serializer.serialize(items).join('\n');
      });
  }

  onSideBarPrimaryChange($event: any) {
    this.selectedSideBarPrimary = $event.tab as unknown as SideBarPrimary;
  }
}
