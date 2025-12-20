import { Component, OnChanges } from '@angular/core';

import { Property } from 'csstype';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { takeUntil } from 'rxjs';
import { NumberField } from '../property-components/number-field';
import { BasePropertyGroupComponent } from './base-property-group.component';
import { PropertyGroupContainerComponent } from './property-group-container.component';
import { Unit } from '@layout/canvas';
import { PropertyRowComponent } from '../property-components/property-row.component';

@Component({
  selector: 'app-properties-box-sizing',
  imports: [
    ReactiveFormsModule,
    NumberField,
    FormsModule,
    PropertyGroupContainerComponent,
    PropertyRowComponent,
  ],
  template: `
    <app-property-group header="Box sizing" [toggleable]="true">
      <ng-container [formGroup]="formGroup">
        <app-property-row label="padding">
          <app-number-field
            [control]="getFormControl('padding')"
            [unit]="getFormControl('paddingUnit')"
          ></app-number-field>
        </app-property-row>

        <app-property-row label="height">
          <app-number-field
            [max]="1000"
            [control]="getFormControl('height')"
            [unit]="getFormControl('heightUnit')"
          ></app-number-field>
        </app-property-row>

        <app-property-row label="width">
          <app-number-field
            [max]="1000"
            [control]="getFormControl('width')"
            [unit]="getFormControl('widthUnit')"
          ></app-number-field>
        </app-property-row>
      </ng-container>
    </app-property-group>
  `,
  styles: `
    :host {
      display: contents;
    }
  `,
})
export class BoxSizingComponent
  extends BasePropertyGroupComponent
  implements OnChanges
{
  items: { label?: string; icon?: string; separator?: boolean }[] = [];

  override ngOnChanges() {
    super.ngOnChanges();

    const cssValue = this.css();
    if (!cssValue?.boxSizing) {
      return;
    }

    this.formGroup?.patchValue(
      {
        padding: this.propertiesService.extractNumericValue(
          cssValue.boxSizing.padding,
        ),
        paddingUnit: this.propertiesService.extractUnit(
          cssValue.boxSizing.padding,
        ),
        height: this.propertiesService.extractNumericValue(
          cssValue.boxSizing.height,
        ),
        heightUnit: this.propertiesService.extractUnit(
          cssValue.boxSizing.height,
        ),
        width: this.propertiesService.extractNumericValue(
          cssValue.boxSizing.width,
        ),
        widthUnit: this.propertiesService.extractUnit(cssValue.boxSizing.width),
      },
      { emitEvent: false },
    );
  }

  protected override createFormGroup() {
    if (this.formGroupValueChangedSubscription) {
      this.formGroupValueChangedSubscription.unsubscribe();
    }

    const formGroup = this.formBuilder.group({
      padding: new FormControl<Property.Padding | null | undefined>(null, {
        updateOn: 'blur',
      }),
      paddingUnit: new FormControl<Unit>(Unit.px),
      height: new FormControl<Property.Height | null | undefined>(null, {
        updateOn: 'blur',
      }),
      heightUnit: new FormControl<Unit>(Unit.px),
      width: new FormControl<Property.Height | null | undefined>(null, {
        updateOn: 'blur',
      }),
      widthUnit: new FormControl<Unit>(Unit.px),
    });

    this.formGroupValueChangedSubscription = formGroup.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((value: any) => {
        // Use PropertiesService to update CSS
        this.propertiesService.updateCssCategory(this.css(), 'boxSizing', {
          height: this.propertiesService.formatWithUnit(
            value.height,
            value.heightUnit,
          ),
          padding: this.propertiesService.formatWithUnit(
            value.padding,
            value.paddingUnit,
          ),
          width: this.propertiesService.formatWithUnit(
            value.width,
            value.widthUnit,
          ),
        });
      });

    return formGroup;
  }
}
