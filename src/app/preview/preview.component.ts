import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HtmlSerializer} from "../core/serialization/serializers/html.serializer";
import {UnsafeHtmlPipe} from "./unsafe-html.pipe";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {CanvasItem} from "../core/models/canvas-item.model";
import {DropdownModule} from "primeng/dropdown";
import {FormsModule} from "@angular/forms";
import {CanvasService} from "../shared/canvas/canvas.service";
import {AppSkeletonComponent} from "../core/app.skeleton.component";
import {SideBarComponent} from "../shared/side-bar/side-bar.component";
import {Button} from "primeng/button";
import {Tooltip} from "primeng/tooltip";
import {CssPrismComponent} from "../core/serialization/prisms/css-prism.component";
import {HtmlPrismComponent} from "../core/serialization/prisms/html-prism.component";
import {JsonPrismComponent} from "../core/serialization/prisms/json-prism.component";

enum MediaQuery {
  AUTO = '100%',
  DESKTOPS_1920 = '1920px',
  DESKTOPS_1280 = '1280px',
  TABLETS_IPADS_1024 = '1024px',
  MOBILES_IPADS_767 = '767px',
  SMALL_MOBILES_480 = '480px'
}

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
  imports: [CommonModule, UnsafeHtmlPipe, DropdownModule, FormsModule, AppSkeletonComponent, SideBarComponent, Button, Tooltip, CssPrismComponent, HtmlPrismComponent, JsonPrismComponent],
  templateUrl: './preview.component.html',
  styleUrl: './preview.component.scss'
})
export class PreviewComponent {
  code: any;
  serializer: HtmlSerializer = new HtmlSerializer();

  selectedSideBarPrimary: SideBarPrimary = SideBarPrimary.BROWSER;
  selectedSidebarSecondary: SideBarSecondaryCode = SideBarSecondaryCode.CSS;
  selectedMediaQuery: MediaQuery = MediaQuery.AUTO;

  mediaQueries: { name: string, width: MediaQuery }[] = [
    {name: 'auto', width: MediaQuery.AUTO},
    {name: 'Desktops (1920)', width: MediaQuery.DESKTOPS_1920},
    {name: 'Desktops (1280)', width: MediaQuery.DESKTOPS_1280},
    {name: 'Tablets, Ipads (1024px)', width: MediaQuery.TABLETS_IPADS_1024},
    {name: 'Mobiles, Ipads (767px)', width: MediaQuery.MOBILES_IPADS_767},
    {name: 'Small mobiles (480px)', width: MediaQuery.SMALL_MOBILES_480}
  ];

  tabs: Tab<SideBarPrimary>[] = [
    {title: 'Code', tab: SideBarPrimary.CODE, icon: 'pi pi-code'},
    {title: 'Screen', tab: SideBarPrimary.BROWSER, icon: 'pi pi-minus'}
  ];

  codeTabs: Tab<SideBarSecondaryCode>[] = [
    {title: 'CSS', tab: SideBarSecondaryCode.CSS, icon: 'pi pi-plus'},
    {title: 'HTML', tab: SideBarSecondaryCode.HTML, icon: 'pi pi-comment'},
    {title: 'JSON', tab: SideBarSecondaryCode.JSON, icon: 'pi pi-code'}
  ];

  constructor(protected canvasService: CanvasService) {

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
