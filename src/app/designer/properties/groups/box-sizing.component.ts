import { Component, OnChanges } from '@angular/core';

import {Property} from "csstype";
import {FormControl, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {takeUntil} from "rxjs";
import {NumberField} from "../components/number-field";
import {BasePropertyGroupComponent} from "../components/base-property-group.component";
import {PropertyGroupComponent} from "../components/property-group.component";
import {Unit} from "../../../core/models/css/unit.enum";
import {Height, Padding, Width} from "../../../core/models/css/properties.enum";
import { PropertyRowComponent } from '../components/property-row.component';

@Component({
  selector: 'app-properties-box-sizing',
  imports: [
    ReactiveFormsModule,
    NumberField,
    FormsModule,
    PropertyGroupComponent,
    PropertyRowComponent,
  ],
  template: `
    <app-property-group header="Box sizing" [toggleable]="true">
      <ng-container [formGroup]="formGroup">
        <app-property-row label="padding">
          <app-number-field
            [control]="getFormControl('padding')"
            [unit]="getFormControl('paddingUnit')"></app-number-field>
        </app-property-row>

        <app-property-row label="height">
          <app-number-field
            [max]="1000"
            [control]="getFormControl('height')"
            [unit]="getFormControl('heightUnit')"></app-number-field>
        </app-property-row>

        <app-property-row label="width">
          <app-number-field
            [max]="1000"
            [control]="getFormControl('width')"
            [unit]="getFormControl('widthUnit')"></app-number-field>
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
  protected readonly Padding = Padding;
  protected readonly Height = Height;
  protected readonly Width = Width;

  items: { label?: string; icon?: string; separator?: boolean }[] = [];

  override ngOnChanges() {
    super.ngOnChanges();

    const cssValue = this.css();
    if (!cssValue?.boxSizing) {
      return;
    }

    this.formGroup?.patchValue(
      {
        padding: this.extractValue(cssValue.boxSizing.padding),
        paddingUnit: this.extractUnit(cssValue.boxSizing.padding),
        height: this.extractValue(cssValue.boxSizing.height),
        heightUnit: this.extractUnit(cssValue.boxSizing.height),
        width: this.extractValue(cssValue.boxSizing.width),
        widthUnit: this.extractUnit(cssValue.boxSizing.width),
      },
      { emitEvent: false }
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
        this.canvasService.updateCss({
          ...this.css(),
          boxSizing: {
            height:
              value.height != null
                ? `${value.height}${value.heightUnit}`
                : value.height,
            padding:
              value.padding != null
                ? `${value.padding}${value.paddingUnit}`
                : value.padding,
            width:
              value.width != null
                ? `${value.width}${value.widthUnit}`
                : value.width,
          },
        });
      });

    return formGroup;
  }
}
