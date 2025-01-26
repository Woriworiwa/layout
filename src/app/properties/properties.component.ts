import {Component, OnDestroy} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CanvasItem} from "../core/models/canvas-item.model";
import {PropertiesFlexContainerComponent} from "./property-groups/flex-container.component";
import {SelectButtonModule} from "primeng/selectbutton";
import {Subject, takeUntil} from "rxjs";
import { CanvasItemType } from '../core/enums';
import {BoxSizingComponent} from "./property-groups/box-sizing.component";
import {DisplayComponent} from "./property-groups/display.component";
import {PropertiesFlexItemComponent} from "./property-groups/flex-item.component";
import {AccordionModule} from "primeng/accordion";
import {PanelModule} from "primeng/panel";
import {MenuModule} from "primeng/menu";
import {DropdownModule} from "primeng/dropdown";
import {ListboxModule} from "primeng/listbox";
import {AppPropertyFilterPipe} from "./filter.pipe";
import {FloatLabelModule} from "primeng/floatlabel";
import {InputTextModule} from "primeng/inputtext";
import {IconFieldModule} from "primeng/iconfield";
import {InputIconModule} from "primeng/inputicon";
import {InputGroupModule} from "primeng/inputgroup";
import {ButtonModule} from "primeng/button";
import {SelectionService} from "../canvas/selection/selection.service";
import {CanvasService} from "../canvas/canvas.service";
import {MetaDataComponent} from "./property-groups/meta-data.component";

export interface Property {
  showSpecificPropertyName?: string;
  showAll: boolean;
}

@Component({
    selector: 'app-settings',
  imports: [CommonModule, ReactiveFormsModule, PropertiesFlexContainerComponent, SelectButtonModule, BoxSizingComponent, DisplayComponent, PropertiesFlexItemComponent, AccordionModule, PanelModule, MenuModule, DropdownModule, FormsModule, ListboxModule, FloatLabelModule, InputTextModule, IconFieldModule, InputIconModule, InputGroupModule, ButtonModule, MetaDataComponent],
    providers: [AppPropertyFilterPipe],
    templateUrl: './properties.component.html',
    styleUrls: ['./properties.component.scss']
})
export class PropertiesComponent implements OnDestroy{
  css: string[] = [];
  frame: CanvasItem | undefined;
  searchText = '';
  items: { label?: string; icon?: string; separator?: boolean }[] = [];

  protected readonly FrameType = CanvasItemType;
  private destroy$ = new Subject();

  constructor(protected canvasService: CanvasService,
              protected selectionService: SelectionService) {
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
