import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {SelectButtonModule} from "primeng/selectbutton";
import {Subject, Subscription, takeUntil, takeWhile} from "rxjs";
import {PropertyPanelRowComponent} from "./property-panel-row.component";
import {CanvasStore} from "../../store/canvas.store";
import {SliderModule} from "primeng/slider";
import {InputNumberModule} from "primeng/inputnumber";
import {FlexDirection, FlexWrap, JustifyContent} from "../../models/enums";
import {Property} from "csstype";
import {DropdownModule} from "primeng/dropdown";
import {FlexLayoutSettings} from "../../models/flex-layout.model";

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
          <p-slider formControlName="gap"></p-slider>
        </div>
      </app-property-panel-row>

      <app-property-panel-row label="Wrap">
        <p-selectButton [options]="flexWrapOptions"
                        formControlName="flexWrap"
                        optionLabel="label"
                        optionValue="value"></p-selectButton>
      </app-property-panel-row>

      <app-property-panel-row label="justify-content">
        <p-dropdown [options]="justifyContentOptions"
                    [formControl]="justifyContent"
                    [showClear]="true"></p-dropdown>
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
export class PropertiesFlex {
  @Input() flexLayoutSettings: FlexLayoutSettings | undefined;

  private destroy$ = new Subject();
  private formUpdating = false;

  get justifyContent(): FormControl {
    return this.formGroup?.get('justifyContent') as FormControl;
  }

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

  formGroup: FormGroup;
  formGroupValueChangedSubscription: Subscription | undefined;

  constructor(public fb: FormBuilder,
              protected frameStore: CanvasStore) {
    this.formGroup = this.createFormGroup();
  }


  createFormGroup() {
    if (this.formGroupValueChangedSubscription) {
      this.formGroupValueChangedSubscription.unsubscribe();
    }

    const formGroup = this.fb.group({
      flexDirection: new FormControl<Property.FlexDirection | null | undefined>(undefined),
      flexWrap: [''],
      gap: new FormControl<Property.Gap | null | undefined>(null),
      justifyContent: new FormControl<Property.JustifyContent | null | undefined>(null)
    });

    this.formGroupValueChangedSubscription = formGroup.valueChanges
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe((value: any) => {
        this.frameStore.updateFlexLayoutSettings(value);
      });

    return formGroup;
  }

  ngOnChanges() {

    this.formGroup = this.createFormGroup();

    if (this.flexLayoutSettings) {
      this.formGroup?.patchValue({
        ...this.flexLayoutSettings,
        gap: this.flexLayoutSettings.gap?.toString()
      }, {emitEvent: false});
    }
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
