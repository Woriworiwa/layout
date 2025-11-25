import { Component, Input, OnDestroy, inject } from '@angular/core';

import {FormsModule} from "@angular/forms";
import {CanvasItem} from "../../core/models/canvas-item.model";
import {PropertiesFlexContainerComponent} from "./groups/flex-container.component";
import {Subject, takeUntil} from "rxjs";
import {CanvasItemType} from '../../core/enums';
import {BoxSizingComponent} from "./groups/box-sizing.component";
import {DisplayComponent} from "./groups/display.component";
import {PropertiesFlexItemComponent} from "./groups/flex-item.component";
import {InputText} from "primeng/inputtext";
import {InputGroup} from "primeng/inputgroup";
import {Button} from "primeng/button";
import {SelectionService} from "../../canvas/selection/selection.service";
import {CanvasService} from "../../canvas/canvas.service";
import {MetaDataComponent} from "./groups/meta-data.component";
import {PropertiesConfig} from "./properties.config";

export interface Property {
  showSpecificPropertyName?: string;
  showAll: boolean;
}

@Component({
  selector: 'app-settings',
  imports: [FormsModule, PropertiesFlexContainerComponent, BoxSizingComponent, DisplayComponent, PropertiesFlexItemComponent, InputText, InputGroup, MetaDataComponent],
  templateUrl: './properties.component.html',
  styleUrls: ['./properties.component.scss']
})
export class PropertiesComponent implements OnDestroy {
  protected canvasService = inject(CanvasService);
  protected selectionService = inject(SelectionService);

  @Input()
  config: PropertiesConfig = {};

  css: string[] = [];
  frame: CanvasItem | undefined;
  searchText = '';
  items: { label?: string; icon?: string; separator?: boolean }[] = [];

  protected readonly FrameType = CanvasItemType;
  private destroy$ = new Subject();

  constructor() {
    this.selectionService.selectedItem$
      .pipe(takeUntil(this.destroy$))
      .subscribe(frame => {
        this.frame = frame;
      });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
