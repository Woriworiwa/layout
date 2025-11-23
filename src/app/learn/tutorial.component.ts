import { Component, OnInit, inject } from '@angular/core';

import {CanvasComponent} from "../shared/canvas/canvas.component";
import {CanvasService} from "../shared/canvas/canvas.service";
import {SelectionService} from "../shared/canvas/selection/selection.service";
import {CanvasStore} from "../core/store/canvas.store";
import {TutorialService} from "./tutorial.service";
import {CanvasItem} from "../core/models/canvas-item.model";
import {AppSkeletonComponent} from "../core/app.skeleton.component";
import {Button} from "primeng/button";
import {SideBarComponent} from "../shared/side-bar/side-bar.component";
import {Tooltip} from "primeng/tooltip";
import {Tab} from "../shared/side-bar/side-bar-tab.model";
import {CanvasSettings} from "../shared/canvas/canvas.settings";
import {CssPrismComponent} from "../renderer/prisms/css-prism.component";
import {AlignmentComponent} from "./subjects/alignment.component";
import {PROPERTIES_CONFIG} from "../shared/properties/properties.config";

enum SideBarPrimary {
  FLEX = 'flex'
}

enum SideBarSecondaryCode {
  ALIGNMENT = 'alignment',
}

@Component({
  selector: 'app-tutorial',
  imports: [CanvasComponent, AppSkeletonComponent, Button, SideBarComponent, Tooltip, CssPrismComponent, AlignmentComponent],
  providers: [
    CanvasService,
    CanvasStore,
    SelectionService,
    TutorialService,
    {
      provide: PROPERTIES_CONFIG,
      useValue: {labelPosition: 'none', selectControlsLayout: 'selectButton'}
    }
  ],
  templateUrl: './tutorial.component.html',
  styleUrl: './tutorial.component.scss',
})
export class TutorialComponent implements OnInit {
  private tutorialService = inject(TutorialService);
  protected selectionService = inject(SelectionService);

  sourceItem: CanvasItem | undefined;
  selectedSideBarPrimary: SideBarPrimary = SideBarPrimary.FLEX;
  selectedSidebarSecondary: SideBarSecondaryCode = SideBarSecondaryCode.ALIGNMENT;
  canvasSettings: CanvasSettings = new CanvasSettings({
    showToolbar: false,
    allowAdd: false,
    allowDragDrop: false,
  });

  tabs: Tab<SideBarPrimary>[] = [
    {title: 'Flex', tab: SideBarPrimary.FLEX, icon: 'pi pi-code'}
  ];

  secondaryTabs: Tab<SideBarSecondaryCode>[] = [
    {title: 'Alignment', tab: SideBarSecondaryCode.ALIGNMENT, icon: 'pi pi-plus'},
  ];

  ngOnInit() {
    this.tutorialService.init();

    this.selectionService.selectedItem$.subscribe(item => {
      this.sourceItem = item;
    })
  }

  onSideBarPrimaryChange($event: any) {
    this.selectedSideBarPrimary = $event.tab as unknown as SideBarPrimary;
  }

  protected readonly SideBarPrimary = SideBarPrimary;
}
