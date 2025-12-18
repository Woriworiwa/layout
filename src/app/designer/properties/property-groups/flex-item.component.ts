import { Component, OnChanges } from '@angular/core';

import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {takeUntil} from "rxjs";
import {NumberField} from "../property-components/number-field";
import {BasePropertyGroupComponent} from "./base-property-group.component";
import {PropertyGroupContainerComponent} from "./property-group-container.component";
import {AlignSelf, FlexBasis, FlexGrow, FlexShrink, Height} from "../../../core/models/css/properties.enum";
import { PropertyRowComponent } from '../property-components/property-row.component';
import { ButtonGroupComponent } from '../property-components/button-group.component';

@Component({
  selector: 'app-properties-flex-item',
  imports: [
    ReactiveFormsModule,
    NumberField,
    PropertyGroupContainerComponent,
    PropertyRowComponent,
    ButtonGroupComponent,
  ],
  template: `
    <ng-container [formGroup]="formGroup">
      <app-property-group [header]="title()" [toggleable]="true">
        <app-property-row label="flex-grow">
          <app-number-field
            [control]="getFormControl('flexGrow')"
            [suffix]="undefined"
            [max]="5"
          ></app-number-field>
        </app-property-row>

        <app-property-row label="flex-shrink">
          <app-number-field
            [control]="getFormControl('flexShrink')"
            [suffix]="undefined"
            [max]="5"
          ></app-number-field>
        </app-property-row>

        <app-property-row label="flex-basis">
          <app-number-field
            [control]="getFormControl('flexBasis')"
            [suffix]="undefined"
            [max]="5"
          ></app-number-field>
        </app-property-row>

        <app-property-row label="align-self">
          <app-button-group
            [options]="alignSelfOptions"
            [control]="getFormControl('alignSelf')"
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
export class PropertiesFlexItemComponent
  extends BasePropertyGroupComponent
  implements OnChanges
{
  protected readonly Height = Height;
  protected readonly FlexGrow = FlexGrow;
  protected readonly FlexShrink = FlexShrink;
  protected readonly FlexBasis = FlexBasis;
  protected readonly AlignSelf = AlignSelf;

  /*justify content*/
  alignSelfOptions = [
    AlignSelf.start,
    AlignSelf.end,
    AlignSelf.center,
    AlignSelf.baseline,
    AlignSelf.stretch,
  ];

  override ngOnChanges() {
    super.ngOnChanges();

    const cssValue = this.css();
    if (cssValue?.flexItem) {
      this.formGroup?.patchValue(cssValue.flexItem, { emitEvent: false });
    }
  }

  protected override createFormGroup() {
    if (this.formGroupValueChangedSubscription) {
      this.formGroupValueChangedSubscription.unsubscribe();
    }

    const formGroup = this.formBuilder.group({
      flexGrow: new FormControl<number | null | undefined>(null, {
        updateOn: 'blur',
      }),
      flexShrink: new FormControl<number | null | undefined>(null, {
        updateOn: 'blur',
      }),
      flexBasis: new FormControl<number | null | undefined>(null, {
        updateOn: 'blur',
      }),
      alignSelf: new FormControl<number | null | undefined>(null, {
        updateOn: 'blur',
      }),
    });

    this.formGroupValueChangedSubscription = formGroup.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((value: any) => {
        this.propertiesService.updateCssCategory(this.css(), 'flexItem', value);
      });

    return formGroup;
  }
}
