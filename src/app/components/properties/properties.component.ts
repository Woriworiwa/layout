import {ChangeDetectionStrategy, ChangeDetectorRef, Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, ReactiveFormsModule} from "@angular/forms";
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

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, PropertiesFlexConainer, PropertyPanelRowComponent, SelectButtonModule, ThemeOptionsComponent, CssPrismComponent, BoxSizingComponent, DisplayComponent, PropertiesFlexItem],
  templateUrl: './properties.component.html',
  styleUrls: ['./properties.component.scss']
})
export class PropertiesComponent {
  css: string[] = [];
  frame: CanvasItem | undefined;

  frameTypeOptions = [
    {label: 'Flex', value: CanvasItemType.FLEX},
    {label: 'Grid', value: CanvasItemType.GRID}
  ]

  // formGroup = this.fb.group({
  //   canvasItemType: [CanvasItemType.FLEX],
  // });

  private destroy$ = new Subject();

  constructor(public fb: FormBuilder,
              protected canvasStore: CanvasStore) {
    this.canvasStore.selectedFrame$
      .subscribe(frame => {
        this.frame = frame;
    })
  }

  ngOnInit() {
    // if (this.frame){
    //   this.formGroup.patchValue(this.frame)
    // }
    //
    // this.formGroup.valueChanges
    //   .pipe(takeUntil(this.destroy$))
    //   .subscribe((value: any) => {
    //       // this.canvasStore.updateFlexLayoutSettings(value);
    //   });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  protected readonly FrameType = CanvasItemType;
}
