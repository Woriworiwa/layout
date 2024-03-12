import {Component} from '@angular/core';
import { CommonModule } from '@angular/common';
import {NbButtonGroupModule, NbCardModule} from "@nebular/theme";
import {FormBuilder, ReactiveFormsModule} from "@angular/forms";
import {Frame, FrameType} from "../core/models/frame.model";
import {PropertiesFlexComponent} from "./flex/properties-flex.component";
import {PropertyPanelRowComponent} from "./property-panel-row.component";
import {SelectButtonModule} from "primeng/selectbutton";
import {map, Subject, takeUntil} from "rxjs";
import {CanvasStore} from "../core/stores/canvas.store";

@Component({
  selector: 'app-properties',
  standalone: true,
  imports: [CommonModule, NbButtonGroupModule, ReactiveFormsModule, PropertiesFlexComponent, NbCardModule, PropertyPanelRowComponent, SelectButtonModule],
  template: `
<!--    <ng-container [formGroup]="formGroup">-->
<!--      <app-property-panel-row label="type">-->
<!--        <p-selectButton [options]="frameTypeOptions"-->
<!--                        formControlName="frameType"-->
<!--                        optionLabel="label"-->
<!--                        optionValue="value"></p-selectButton>-->
<!--      </app-property-panel-row>-->
<!--    </ng-container>-->

    @switch (frame?.frameType) {
      @case (FrameType.FLEX) {
        <app-properties-flex [flexLayoutSettings]="frame?.flexLayoutSettings"></app-properties-flex>
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
  frame: Frame | undefined;

  frameTypeOptions = [
    {label: 'Flex', value: FrameType.FLEX},
    {label: 'Grid', value: FrameType.GRID}
  ]

  formGroup = this.fb.group({
    frameType: [FrameType.FLEX],
  });

  private destroy$ = new Subject();

  constructor(public fb: FormBuilder,
              protected canvasStore: CanvasStore) {
    this.canvasStore.state.pipe(
      map( _ => this.canvasStore.getSelectedFrame())
    ).subscribe(frame => {
      this.frame = frame;
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
