import { Component, OnChanges } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Property } from 'csstype';
import { takeUntil } from 'rxjs';
import { BasePropertyGroupComponent } from '../components/base-property-group.component';
import { PropertyGroupComponent } from '../components/property-group.component';
import { DisplayOptions } from '@layout/models';
import { PropertyRowComponent } from '../components/property-row.component';
import { ButtonGroupComponent } from '../components/button-group.component';
import { NumberField } from '../components/number-field';

@Component({
  selector: 'app-properties-layout',
  imports: [
    ReactiveFormsModule,
    PropertyGroupComponent,
    PropertyRowComponent,
    ButtonGroupComponent,
    NumberField,
  ],
  template: `
    <app-property-group
      header="Layout"
      [toggleable]="true"
      [collapsed]="collapsed()"
      groupId="layout"
    >
      <app-property-row label="display" [control]="getFormControl('display')">
        <app-button-group
          [options]="DisplayOptions"
          [control]="getFormControl('display')"
        ></app-button-group>
      </app-property-row>
    </app-property-group>
  `,
  styles: `
    :host {
      display: contents;
    }
  `,
})
export class LayoutComponent
  extends BasePropertyGroupComponent
  implements OnChanges
{
  override ngOnChanges() {
    super.ngOnChanges();

    const cssValue = this.css();
    if (cssValue?.layout) {
      this.formGroup?.patchValue(cssValue.layout, { emitEvent: false });
    }
  }

  override createFormGroup() {
    if (this.formGroupValueChangedSubscription) {
      this.formGroupValueChangedSubscription.unsubscribe();
    }

    const formGroup = this.formBuilder.group({
      display: new FormControl<Property.Display | null | undefined>(null)
    });

    this.formGroupValueChangedSubscription = formGroup.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        this.propertiesService.updateCssCategory(this.css(), 'layout', value);
      });

    return formGroup;
  }

  protected readonly DisplayOptions = DisplayOptions;
}
