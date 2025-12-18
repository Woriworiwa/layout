import { Component, OnChanges } from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {takeUntil} from "rxjs";
import {Property} from "csstype";
import {ButtonGroupComponent} from "../property-components/button-group.component";
import {NumberField} from "../property-components/number-field";
import {BasePropertyGroupComponent} from "./base-property-group.component";
import {PropertyGroupContainerComponent} from "./property-group-container.component";
import {
  AlignContent,
  AlignItems,
  FlexDirection,
  FlexWrap,
  JustifyContent
} from "../../../core/models/css/properties.enum";
import { PropertyRowComponent } from '../property-components/property-row.component';

@Component({
  selector: 'app-properties-flex-container',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonGroupComponent,
    NumberField,
    PropertyGroupContainerComponent,
    PropertyRowComponent,
  ],
  template: `
    <ng-container [formGroup]="formGroup">
        <app-property-group [header]="title()" [toggleable]="true">
          <app-property-row label="direction">
            <app-button-group
              [options]="flexDirectionOptions"
              [control]="getFormControl('flexDirection')"
            ></app-button-group>
          </app-property-row>

          <app-property-row label="gap">
            <app-number-field
              [control]="getFormControl('gap')"></app-number-field>
          </app-property-row>

          <app-property-row label="wrap">
            <app-button-group
              [options]="flexWrapOptions"
              [control]="getFormControl('flexWrap')"
            ></app-button-group>
          </app-property-row>

          <app-property-row label="justify-content">
            <app-button-group
              [options]="justifyContentOptions"
              [control]="getFormControl('justifyContent')"
            ></app-button-group>
          </app-property-row>

          <app-property-row label="align-items">
            <app-button-group
              [options]="alignItemsOptions"
              [control]="getFormControl('alignItems')"
            ></app-button-group>
          </app-property-row>

          <app-property-row label="align-content">
            <app-button-group
              [options]="alignContentOptions"
              [control]="getFormControl('alignContent')"
            ></app-button-group>
          </app-property-row>
        </app-property-group>
    </ng-container>
  `,
  styles: `
    :host {
      display: contents;
    }
  `,
})
export class PropertiesFlexContainerComponent extends BasePropertyGroupComponent implements OnChanges
{

  /*direction*/
  flexDirectionOptions = [
    { label: 'Row', value: FlexDirection.row },
    { label: 'Column', value: FlexDirection.column },
  ];

  /*wrap*/
  flexWrapOptions = [
    { label: 'Yes', value: FlexWrap.wrap },
    { label: 'No', value: FlexWrap.nowrap },
  ];

  /*justify content*/
  justifyContentOptions = [
    JustifyContent.center,
    JustifyContent.start,
    JustifyContent.end,
    JustifyContent['space-around'],
    JustifyContent['space-between'],
    JustifyContent['space-evenly'],
  ];

  /*align items*/
  alignItemsOptions = [
    AlignItems.start,
    AlignItems.end,
    AlignItems.center,
    AlignItems.stretch,
    AlignItems.baseline,
  ];

  /*align content*/
  alignContentOptions = [
    AlignContent.start,
    AlignContent.end,
    AlignContent.center,
    AlignContent.stretch,
    AlignContent['space-between'],
    AlignContent['space-around'],
    AlignContent['space-evenly'],
    AlignContent.baseline,
  ];

  override ngOnChanges() {
    super.ngOnChanges();

    const mergedValues = this.propertiesService.mergeContainerPropsForForm(
      this.css(),
      'flexContainer',
      { gap: (val) => val?.toString() }
    );

    this.formGroup?.patchValue(mergedValues, { emitEvent: false });
  }

  override createFormGroup() {
    if (this.formGroupValueChangedSubscription) {
      this.formGroupValueChangedSubscription.unsubscribe();
    }

    const formGroup = this.formBuilder.group({
      flexDirection: new FormControl<Property.FlexDirection | null | undefined>(
        undefined
      ),
      flexWrap: new FormControl<Property.FlexWrap | null | undefined>(
        undefined
      ),
      gap: new FormControl<Property.Gap | null | undefined>(null, {
        updateOn: 'blur',
      }),
      justifyContent: new FormControl<
        Property.JustifyContent | null | undefined
      >(null),
      alignItems: new FormControl<Property.AlignItems | null | undefined>(null),
      alignContent: new FormControl<Property.AlignContent | null | undefined>(
        null
      ),
    });

    this.formGroupValueChangedSubscription = formGroup.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((value: any) => {
        this.propertiesService.updateCssWithSplit(this.css(), value, 'flexContainer');
      });

    return formGroup;
  }
}
