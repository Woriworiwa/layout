import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FlexLayoutSettings} from "../../models/frame.model";
import {FormBuilder, FormControl, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {SelectButtonModule} from "primeng/selectbutton";
import {Subject, takeUntil} from "rxjs";
import {PropertyPanelRowComponent} from "./property-panel-row.component";
import {CanvasStore} from "../../store/canvas.store";
import {SliderModule} from "primeng/slider";
import {InputNumberModule} from "primeng/inputnumber";
import {FlexDirection, FlexWrap, JustifyContent} from "../../models/enums";
import {Property} from "csstype";
import {DropdownModule} from "primeng/dropdown";

@Component({
  selector: 'app-settings-flex',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ReactiveFormsModule, SelectButtonModule, PropertyPanelRowComponent, FormsModule, SliderModule, InputNumberModule, DropdownModule],
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

      <app-property-panel-row label="justify-content">
        <p-dropdown [options]="justifyContentOptions" formControlName="justifyContent" [showClear]="true"></p-dropdown>
      </app-property-panel-row>
    </ng-container>
  `,
  styles: `
    :host {
      display: contents;
    }

    app-property-panel-row {
      display: contents;
    }
  `
})
export class SettingsFlex {
  @Input() flexLayoutSettings: FlexLayoutSettings | undefined;

  private destroy$ = new Subject();

  /*direction*/
  flexDirectionOptions = [
    {label: 'Row', value: FlexDirection.row},
    {label: 'Column', value: FlexDirection.column}
  ]

  /*wrap*/
  flexWrapOptions = [
    {label: 'Yes', value: FlexWrap.wrap},
    {label: 'No', value: FlexWrap.nowrap}
  ]

  justifyContentOptions = [
    JustifyContent.center,
    JustifyContent.start,
    JustifyContent.end,
    JustifyContent["space-around"],
    JustifyContent["space-between"],
    JustifyContent["space-evenly"]
  ]

  formGroup = this.fb.group({
    flexDirection: [''],
    flexWrap: [''],
    gap: [''],
    justifyContent: new FormControl<Property.JustifyContent | null>(null)
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

      this.formGroup.patchValue({...this.flexLayoutSettings, gap: this.flexLayoutSettings.gap.toString()}, {emitEvent: false});
    }
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
