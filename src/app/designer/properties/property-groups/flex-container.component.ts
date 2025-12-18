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
  AlignContentOptions,
  AlignItems,
  AlignItemsOptions,
  FlexDirection,
  FlexDirectionOptions,
  FlexWrap,
  FlexWrapOptions,
  JustifyContent,
  JustifyContentOptions,
} from '../../../core/models/css-enums/properties.enum';
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
            [options]="FlexDirectionOptions"
            [control]="getFormControl('flexDirection')"
          ></app-button-group>
        </app-property-row>

        <app-property-row label="gap">
          <app-number-field
            [control]="getFormControl('gap')"
          ></app-number-field>
        </app-property-row>

        <app-property-row label="wrap">
          <app-button-group
            [options]="FlexWrapOptions"
            [control]="getFormControl('flexWrap')"
          ></app-button-group>
        </app-property-row>

        <app-property-row label="justify-content">
          <app-button-group
            [options]="JustifyContentOptions"
            [control]="getFormControl('justifyContent')"
          ></app-button-group>
        </app-property-row>

        <app-property-row label="align-items">
          <app-button-group
            [options]="AlignItemsOptions"
            [control]="getFormControl('alignItems')"
          ></app-button-group>
        </app-property-row>

        <app-property-row label="align-content">
          <app-button-group
            [options]="AlignContentOptions"
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
export class PropertiesFlexContainerComponent
  extends BasePropertyGroupComponent
  implements OnChanges
{
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
        this.propertiesService.updateCssWithSplit(
          this.css(),
          value,
          'flexContainer'
        );
      });

    return formGroup;
  }

  protected readonly JustifyContentOptions = JustifyContentOptions;
  protected readonly AlignItemsOptions = AlignItemsOptions;
  protected readonly AlignContentOptions = AlignContentOptions;
  protected readonly FlexDirectionOptions = FlexDirectionOptions;
  protected readonly FlexWrapOptions = FlexWrapOptions;
}
