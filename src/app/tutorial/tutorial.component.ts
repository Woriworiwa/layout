import {Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import {CanvasComponent} from "../shared/canvas/canvas.component";
import {CanvasService} from "../shared/canvas/canvas.service";
import {SelectionService} from "../shared/canvas/selection/selection.service";
import {CanvasStore} from "../core/store/canvas.store";
import {TutorialService} from "./tutorial.service";
import {PropertiesFlexContainerComponent} from "../shared/properties/property-group/flex-container.component";
import {CanvasItem} from "../core/models/canvas-item.model";
import {AppSkeletonComponent} from "../app.skeleton.component";
import {JustifyContent} from "../core/models/css/properties.enum";

@Component({
  selector: 'app-tutorial',
  imports: [CommonModule, CanvasComponent, PropertiesFlexContainerComponent, AppSkeletonComponent],
  providers: [CanvasService, CanvasStore, SelectionService, TutorialService],
  templateUrl: './tutorial.component.html',
  styleUrl: './tutorial.component.scss',
})
export class TutorialComponent implements OnInit{
  sourceItem: CanvasItem | undefined;

  constructor(private tutorialService: TutorialService,
              protected selectionService: SelectionService) {
  }

  ngOnInit() {
    this.tutorialService.init();
    this.selectionService.selectedItem$.subscribe(item => {
      this.sourceItem = item;
    })
  }

  protected readonly JustifyContent = JustifyContent;
}
