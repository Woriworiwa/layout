import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FlexDirection, FlexLayoutSettings, FlexWrap} from "../core/models/frame.model";
import {NbButtonGroupModule} from "@nebular/theme";
import {FormBuilder, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {SelectButtonModule} from "primeng/selectbutton";
import {Subject, takeUntil} from "rxjs";
import {PropertyPanelRowComponent} from "./property-panel-row.component";
import {CanvasStore} from "../core/stores/canvas.store";
import {SliderModule} from "primeng/slider";
import {InputNumberModule} from "primeng/inputnumber";

@Component({
  selector: 'app-properties-flex',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, NbButtonGroupModule, ReactiveFormsModule, SelectButtonModule, PropertyPanelRowComponent, FormsModule, SliderModule, InputNumberModule],
  template: `
    <ng-container [formGroup]="formGroup">
      <app-property-panel-row label="Direction">
        <p-selectButton [options]="flexDirectionOptions"
                        formControlName="flexDirection"
                        optionLabel="label"
                        optionValue="value"></p-selectButton>
      </app-property-panel-row>

      <app-property-panel-row label="gap">
        <div>
          <p-inputNumber inputId="integeronly" formControlName="gap"></p-inputNumber>
          <p-slider formControlName="gap" class="w-full"></p-slider>
        </div>
      </app-property-panel-row>

      <app-property-panel-row label="Wrap">
        <p-selectButton [options]="flexWrapOptions"
                        formControlName="flexWrap"
                        optionLabel="label"
                        optionValue="value"></p-selectButton>
      </app-property-panel-row>
    </ng-container>
  `,
  styles: `
    :host {
      display: contents;
    }
  `
})
export class PropertiesFlexComponent {
  @Input() flexLayoutSettings: FlexLayoutSettings | undefined;

  private destroy$ = new Subject();

  /*direction*/
  flexDirectionOptions = [
    {label: 'Row', value: FlexDirection.ROW},
    {label: 'Column', value: FlexDirection.COLUMN}
  ]

  /*wrap*/
  flexWrapOptions = [
    {label: 'Yes', value: true},
    {label: 'No', value: false}
  ]

  formGroup = this.fb.group({
    flexDirection: [FlexDirection.ROW],
    flexWrap: [FlexWrap.NOWRAP],
    gap: [0]
  });

  constructor(public fb: FormBuilder,
              protected frameStore: CanvasStore) {
  }

  ngOnInit() {
    this.formGroup.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((value: any) => {
        this.frameStore.updateFlexLayoutSettings(value);
      });
  }

  ngOnChanges() {
    if (this.flexLayoutSettings) {
      if (this.flexLayoutSettings.gap == null) {
        this.flexLayoutSettings.gap = 0;
      }

      this.formGroup.patchValue(this.flexLayoutSettings, {emitEvent: false});
    }
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
