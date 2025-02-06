import {Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import {CanvasComponent} from "../shared/canvas/canvas.component";
import {CanvasService} from "../shared/canvas/canvas.service";
import {SelectionService} from "../shared/canvas/selection/selection.service";
import {CanvasStore} from "../core/store/canvas.store";
import {TutorialService} from "./tutorial.service";
import {PropertiesFlexContainerComponent} from "../shared/properties/property-group/flex-container.component";
import {CanvasItem} from "../core/models/canvas-item.model";
import {AppSkeletonComponent} from "../core/app.skeleton.component";
import {JustifyContent} from "../core/models/css/properties.enum";
import {Button} from "primeng/button";
import {SideBarComponent} from "../shared/side-bar/side-bar.component";
import {Tooltip} from "primeng/tooltip";
import {Tab} from "../shared/side-bar/side-bar-tab.model";
import {CanvasSettings} from "../shared/canvas/canvas.settings";
import {CssPrismComponent} from "../code/prisms/css-prism.component";

enum SideBarPrimary {
  FLEX = 'flex'
}

enum SideBarSecondaryCode {
  JUSTIFY_CONTENT = 'justify-content',
}

@Component({
  selector: 'app-tutorial',
  imports: [CommonModule, CanvasComponent, PropertiesFlexContainerComponent, AppSkeletonComponent, Button, SideBarComponent, Tooltip, CssPrismComponent],
  providers: [CanvasService, CanvasStore, SelectionService, TutorialService],
  templateUrl: './tutorial.component.html',
  styleUrl: './tutorial.component.scss',
})
export class TutorialComponent implements OnInit{
  sourceItem: CanvasItem | undefined;
  selectedSideBarPrimary: SideBarPrimary = SideBarPrimary.FLEX;
  selectedSidebarSecondary: SideBarSecondaryCode = SideBarSecondaryCode.JUSTIFY_CONTENT;
  canvasSettings: CanvasSettings = new CanvasSettings({showToolbar: false});

  tabs: Tab<SideBarPrimary>[] = [
    {title: 'Flex', tab: SideBarPrimary.FLEX, icon: 'pi pi-code'}
  ];

  secondaryTabs: Tab<SideBarSecondaryCode>[] = [
    {title: 'justify-content', tab: SideBarSecondaryCode.JUSTIFY_CONTENT, icon: 'pi pi-plus'}
  ];

  constructor(private tutorialService: TutorialService,
              protected selectionService: SelectionService) {
  }

  ngOnInit() {
    this.tutorialService.init();

    this.selectionService.selectedItem$.subscribe(item => {
      this.sourceItem = item;
    })
  }

  onSideBarPrimaryChange($event: any) {
    this.selectedSideBarPrimary = $event.tab as unknown as SideBarPrimary;
  }

  protected readonly JustifyContent = JustifyContent;
  protected readonly SideBarPrimary = SideBarPrimary;

}
