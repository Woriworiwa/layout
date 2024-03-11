import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FrameService} from "../services/frame.service";
import {NbButtonGroupModule, NbCardModule} from "@nebular/theme";
import {FormBuilder, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {FrameSettings, FrameType, FlexDirection} from "../services/frame.model";
import {FrameGridComponent} from "../frame/frame.grid.component";
import {FrameFlexComponent} from "../frame/frame.flex.component";
import {PropertiesFlexComponent} from "./flex/properties-flex.component";
import {PropertyPanelRowComponent} from "./property-panel-row.component";
import {SelectButtonModule} from "primeng/selectbutton";
import {Subject, takeUntil} from "rxjs";

@Component({
  selector: 'app-properties',
  standalone: true,
  imports: [CommonModule, NbButtonGroupModule, ReactiveFormsModule, FrameGridComponent, FrameFlexComponent, PropertiesFlexComponent, NbCardModule, PropertyPanelRowComponent, SelectButtonModule],
  template: `
    <ng-container [formGroup]="formGroup">
      <app-property-panel-row label="type">
        <p-selectButton [options]="frameTypeOptions"
                        formControlName="frameType"
                        optionLabel="label"
                        optionValue="value"></p-selectButton>
      </app-property-panel-row>
    </ng-container>

    @switch ((frameService.frameSettings$|async)?.frameType) {
      @case (FrameType.FLEX) {
        <app-properties-flex></app-properties-flex>
      }
      @case (FrameType.GRID) {

      }
    }

  `,
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }
  `
})
export class PropertiesComponent {
  frameTypeOptions = [
    {label: 'Flex', value: FrameType.FLEX},
    {label: 'Grid', value: FrameType.GRID}
  ]

  formGroup = this.fb.group({
    frameType: [FrameType.FLEX],
  });

  private destroy$ = new Subject();

  constructor(public fb: FormBuilder,
              protected frameService: FrameService) {
  }

  ngOnInit() {
    this.formGroup.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((value: any) => {
        this.frameService.updateFrameSettings(value);
      });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  protected readonly FrameType = FrameType;
}
