import {Component, OnDestroy} from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule} from "@angular/forms";
import {Tooltip} from "primeng/tooltip";
import {InsertComponent} from "../insert/insert.component";
import {LayersComponent} from "../layers/layers.component";
import {Button} from "primeng/button";
import {AppStateService} from "../../core/app-state.service";
import {SideBarSecondary, SideBarPrimary, MainAreaContent} from "../../core/models/enums";
import {CanvasService} from "../../canvas/canvas.service";
import {SelectionService} from "../../canvas/selection/selection.service";
import {Subject, takeUntil} from "rxjs";
import {CanvasItem} from "../../core/models/canvas-item.model";
import {InspectorComponent} from "../inspector/inspector.component";

@Component({
  selector: 'app-side-bar',
  imports: [CommonModule, FormsModule, Tooltip, InsertComponent, LayersComponent, Button, InspectorComponent],
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.scss',
})
export class SideBarComponent implements OnDestroy {
  private destroy$ = new Subject();
  frame: CanvasItem | undefined;
  selectedTab: SideBarPrimary = SideBarPrimary.insert;
  selectedCodeTab: SideBarSecondary = SideBarSecondary.CSS;

  tabs: {title: string, tab: SideBarPrimary, icon: string}[] = [
    { title: 'Insert', tab: SideBarPrimary.insert, icon: 'pi pi-plus' },
    { title: 'Layers', tab: SideBarPrimary.elements, icon: 'pi pi-comment' },
    { title: 'Inspect', tab: SideBarPrimary.inspect, icon: 'pi pi-code' },
    { title: 'Code', tab: SideBarPrimary.code, icon: 'pi pi-code' }
  ];

  codeTabs = [
    { title: 'CSS', tab: SideBarSecondary.CSS, icon: 'pi pi-plus' },
    { title: 'HTML', tab: SideBarSecondary.HTML, icon: 'pi pi-comment' },
    { title: 'JSON', tab: SideBarSecondary.JSON, icon: 'pi pi-code' },
  ];

  protected readonly sideBarPrimary = SideBarPrimary;

  constructor(protected appStateService: AppStateService,
              protected selectionService: SelectionService,
              protected canvasService: CanvasService) {
    this.selectionService.hoverItem$
      .pipe(takeUntil(this.destroy$))
      .subscribe(frame => {
        this.frame = frame;
      });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  toggleDarkMode() {
    this.appStateService.appState.update((state) => ({ ...state, darkTheme: !state.darkTheme }));
  }

  setSelectedSampleAppsSidebarNav(nav: any) {
    this.selectedTab = nav.tab;

    if (nav.tab === SideBarPrimary.code) {
      this.appStateService.setAppLayout({mainAreaContent: MainAreaContent.CODE});
    } else {
      this.appStateService.setAppLayout({mainAreaContent: MainAreaContent.CANVAS});
    }
  }

  setSelectedCodeTab(tab: any) {
    this.appStateService.setAppLayout({sideBarSecondary: tab.tab});
  }
}




