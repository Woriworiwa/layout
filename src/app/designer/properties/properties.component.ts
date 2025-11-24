import { Component, Input, OnDestroy, inject } from '@angular/core';

import {FormsModule} from "@angular/forms";
import {CanvasItem} from "../../core/models/canvas-item.model";
import {PropertiesFlexContainerComponent} from "../../shared/properties/property-group/flex-container.component";
import {Subject, takeUntil} from "rxjs";
import {CanvasItemType} from '../../core/enums';
import {BoxSizingComponent} from "../../shared/properties/property-group/box-sizing.component";
import {DisplayComponent} from "../../shared/properties/property-group/display.component";
import {PropertiesFlexItemComponent} from "../../shared/properties/property-group/flex-item.component";
import {InputText} from "primeng/inputtext";
import {InputGroup} from "primeng/inputgroup";
import {Button} from "primeng/button";
import {SelectionService} from "../../shared/canvas/selection/selection.service";
import {CanvasService} from "../../shared/canvas/canvas.service";
import {MetaDataComponent} from "../../shared/properties/property-group/meta-data.component";
import {PropertiesConfig} from "../../shared/properties/properties.config";

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
