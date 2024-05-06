import {ChangeDetectionStrategy, ChangeDetectorRef, Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CanvasItem} from "../../models/canvas-item.model";
import {PropertiesFlexConainer} from "./flex-container.component";
import {PropertyPanelRowComponent} from "./property-items/property-panel-row.component";
import {SelectButtonModule} from "primeng/selectbutton";
import {Subject, takeUntil} from "rxjs";
import {CanvasStore} from "../../store/canvas.store";
import { CanvasItemType } from '../../models/enums';
import {ThemeOptionsComponent} from "../settings/theme-options.component";
import {CssPrismComponent} from "../prisms/css-prism.component";
import {BoxSizingComponent} from "./box-sizing.component";
import {DisplayComponent} from "./display.component";
import {PropertiesFlexItem} from "./flex-item.component";
import {AccordionModule} from "primeng/accordion";
import {PanelModule} from "primeng/panel";
import {MenuModule} from "primeng/menu";
import {DropdownModule} from "primeng/dropdown";
import {ListboxModule} from "primeng/listbox";
import {AppPropertyFilterPipe} from "../../pipes/filter.pipe";
import {FloatLabelModule} from "primeng/floatlabel";
import {InputTextModule} from "primeng/inputtext";
import {IconFieldModule} from "primeng/iconfield";
import {InputIconModule} from "primeng/inputicon";
import {InputGroupModule} from "primeng/inputgroup";
import {ButtonModule} from "primeng/button";

export interface Property {
  showSpecificPropertyName?: string;
  showAll: boolean;
}

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, PropertiesFlexConainer, PropertyPanelRowComponent, SelectButtonModule, ThemeOptionsComponent, CssPrismComponent, BoxSizingComponent, DisplayComponent, PropertiesFlexItem, AccordionModule, PanelModule, MenuModule, DropdownModule, FormsModule, ListboxModule, AppPropertyFilterPipe, FloatLabelModule, InputTextModule, IconFieldModule, InputIconModule, InputGroupModule, ButtonModule],
  providers: [AppPropertyFilterPipe],
  templateUrl: './properties.component.html',
  styleUrls: ['./properties.component.scss']
})
export class PropertiesComponent {
  css: string[] = [];
  frame: CanvasItem | undefined;
  searchText = '';

  items: { label?: string; icon?: string; separator?: boolean }[] = [];


  private destroy$ = new Subject();

  constructor(public fb: FormBuilder,
              protected canvasStore: CanvasStore) {
    this.canvasStore.selectedCanvasItem$
      .subscribe(frame => {
        this.frame = frame;
    });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
  protected readonly FrameType = CanvasItemType;
}
