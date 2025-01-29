import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {CanvasComponent} from "../shared/canvas/canvas.component";
import {CanvasService} from "../shared/canvas/canvas.service";
import {SelectionService} from "../shared/canvas/selection/selection.service";
import {CanvasStore} from "../core/store/canvas.store";
import {TutorialService} from "./tutorial.service";
import {PropertiesFlexContainerComponent} from "../designer/properties/property-groups/flex-container.component";
import {CanvasItem} from "../core/models/canvas-item.model";
import {AppPropertyFilterPipe} from "../designer/properties/filter.pipe";
import {AppSkeletonComponent} from "../app.skeleton.component";

@Component({
  selector: 'app-tutorial',
  imports: [CommonModule, CanvasComponent, PropertiesFlexContainerComponent, AppSkeletonComponent],
  providers: [CanvasService, CanvasStore, SelectionService, TutorialService, AppPropertyFilterPipe],
  templateUrl: './tutorial.component.html',
  styleUrl: './tutorial.component.scss',
})
export class TutorialComponent {
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
}
