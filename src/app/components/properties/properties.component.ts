import {ChangeDetectionStrategy, ChangeDetectorRef, Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, ReactiveFormsModule} from "@angular/forms";
import {CanvasItem} from "../../models/canvas-item.model";
import {PropertiesFlex} from "./flex.component";
import {PropertyPanelRowComponent} from "./property-items/property-panel-row.component";
import {SelectButtonModule} from "primeng/selectbutton";
import {Subject, takeUntil} from "rxjs";
import {CanvasStore} from "../../store/canvas.store";
import { FrameType } from '../../models/enums';
import {ThemeOptionsComponent} from "../settings/theme-options.component";
import {SerializerService} from "../../services/serializer.service";
import {CssPrismComponent} from "../prisms/css-prism.component";
import {BoxSizingComponent} from "./box-sizing.component";
import {DisplayComponent} from "./display.component";

@Component({
  selector: 'app-settings',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ReactiveFormsModule, PropertiesFlex, PropertyPanelRowComponent, SelectButtonModule, ThemeOptionsComponent, CssPrismComponent, BoxSizingComponent, DisplayComponent],
  templateUrl: './properties.component.html',
  styleUrls: ['./properties.component.scss']
})
export class PropertiesComponent {
  css: string | undefined;

  frame: CanvasItem | undefined;

  frameTypeOptions = [
    {label: 'Flex', value: FrameType.FLEX},
    {label: 'Grid', value: FrameType.GRID}
  ]

  formGroup = this.fb.group({
    frameType: [FrameType.FLEX],
  });

  private destroy$ = new Subject();

  constructor(public fb: FormBuilder,
              private cd: ChangeDetectorRef,
              protected canvasStore: CanvasStore,
              private serializerService: SerializerService) {
    this.canvasStore.selectedFrame$
      .subscribe(frame => {
        this.frame = frame;
        this.css = this.serializerService.serializeToCssClasses(frame ? [frame] : this.canvasStore.frames).join('\n');
        this.cd.markForCheck();
    })
  }

  ngOnInit() {
    if (this.frame){
      this.formGroup.patchValue(this.frame)
    }

    this.formGroup.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((value: any) => {
          // this.canvasStore.updateFlexLayoutSettings(value);
      });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  protected readonly FrameType = FrameType;
}
