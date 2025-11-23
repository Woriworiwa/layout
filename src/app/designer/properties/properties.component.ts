import { Component, Input, OnDestroy, inject } from '@angular/core';

import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CanvasItem} from "../../core/models/canvas-item.model";
import {PropertiesFlexContainerComponent} from "../../shared/properties/property-group/flex-container.component";
import {SelectButtonModule} from "primeng/selectbutton";
import {Subject, takeUntil} from "rxjs";
import {CanvasItemType} from '../../core/enums';
import {BoxSizingComponent} from "../../shared/properties/property-group/box-sizing.component";
import {DisplayComponent} from "../../shared/properties/property-group/display.component";
import {PropertiesFlexItemComponent} from "../../shared/properties/property-group/flex-item.component";
import {AccordionModule} from "primeng/accordion";
import {PanelModule} from "primeng/panel";
import {MenuModule} from "primeng/menu";
import {DropdownModule} from "primeng/dropdown";
import {ListboxModule} from "primeng/listbox";
import {FloatLabelModule} from "primeng/floatlabel";
import {InputTextModule} from "primeng/inputtext";
import {IconFieldModule} from "primeng/iconfield";
import {InputIconModule} from "primeng/inputicon";
import {InputGroupModule} from "primeng/inputgroup";
import {ButtonModule} from "primeng/button";
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
  imports: [ReactiveFormsModule, PropertiesFlexContainerComponent, SelectButtonModule, BoxSizingComponent, DisplayComponent, PropertiesFlexItemComponent, AccordionModule, PanelModule, MenuModule, DropdownModule, FormsModule, ListboxModule, FloatLabelModule, InputTextModule, IconFieldModule, InputIconModule, InputGroupModule, ButtonModule, MetaDataComponent],
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
