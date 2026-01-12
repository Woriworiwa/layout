import { Component, inject, OnChanges } from '@angular/core';

import { Property } from 'csstype';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { takeUntil } from 'rxjs';
import { NumberField } from '../components/number-field';
import { BasePropertyGroupComponent } from '../components/base-property-group.component';
import { PropertyGroupComponent } from '../components/property-group.component';
import { Unit } from '@layout/models';
import { PropertyRowComponent } from '../components/property-row.component';
import { CanvasService } from '@layout/canvas';

@Component({
  selector: 'app-properties-sizing-spacing',
  imports: [
    ReactiveFormsModule,
    NumberField,
    FormsModule,
    PropertyGroupComponent,
    PropertyRowComponent,
  ],
  template: `
    <app-property-group
      [header]="title()"
      [toggleable]="true"
      [collapsed]="collapsed()"
      groupId="box-sizing"
    >
      <ng-container [formGroup]="formGroup">
        <app-property-row label="padding" [control]="getFormControl('padding')">
          <app-number-field
            [control]="getFormControl('padding')"
            [unit]="getFormControl('paddingUnit')"
          ></app-number-field>
        </app-property-row>

        <app-property-row label="height" [control]="getFormControl('height')">
          <app-number-field
            [max]="1000"
            [control]="getFormControl('height')"
            [unit]="getFormControl('heightUnit')"
          ></app-number-field>
        </app-property-row>

        <app-property-row label="width" [control]="getFormControl('width')">
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
export class SizingSpacingComponent
  extends BasePropertyGroupComponent
  implements OnChanges
{
  private canvasService = inject(CanvasService);

  items: { label?: string; icon?: string; separator?: boolean }[] = [];

  override ngOnChanges() {
    super.ngOnChanges();

    const cssValue = this.css();
    if (!cssValue) {
      return;
    }

    this.formGroup?.patchValue(
      {
        padding: this.propertiesService.extractNumericValue(
          cssValue.spacing?.padding,
        ),
        paddingUnit: this.propertiesService.extractUnit(
          cssValue.spacing?.padding,
        ),
        height: this.propertiesService.extractNumericValue(
          cssValue.sizing?.height,
        ),
        heightUnit: this.propertiesService.extractUnit(
          cssValue.sizing?.height,
        ),
        width: this.propertiesService.extractNumericValue(
          cssValue.sizing?.width,
        ),
        widthUnit: this.propertiesService.extractUnit(cssValue.sizing?.width),
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
      .subscribe((value) => {
        const currentCss = this.css();

        // Merge both spacing and sizing updates in a single call
        // to avoid one update overwriting the other
        this.canvasService.updateCss({
          ...currentCss,
          spacing: {
            ...currentCss?.spacing,
            padding: this.propertiesService.formatWithUnit(
              value.padding,
              value.paddingUnit,
            ) ?? undefined,
          },
          sizing: {
            ...currentCss?.sizing,
            height: this.propertiesService.formatWithUnit(
              value.height,
              value.heightUnit,
            ) ?? undefined,
            width: this.propertiesService.formatWithUnit(
              value.width,
              value.widthUnit,
            ) ?? undefined,
          },
        });
      });

    return formGroup;
  }
}
