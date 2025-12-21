import { Component, OnChanges } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Property } from 'csstype';
import { takeUntil } from 'rxjs';
import { BasePropertyGroupComponent } from './base-property-group.component';
import { PropertyGroupContainerComponent } from './property-group-container.component';
import { DisplayOptions } from '@layout/canvas';
import { PropertyRowComponent } from '../property-components/property-row.component';
import { ButtonGroupComponent } from '../property-components/button-group.component';

@Component({
  selector: 'app-properties-display',
  imports: [
    ReactiveFormsModule,
    PropertyGroupContainerComponent,
    PropertyRowComponent,
    ButtonGroupComponent,
  ],
  template: `
    <app-property-group header="Display" [toggleable]="true">
      <app-property-row label="display">
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
export class DisplayComponent
  extends BasePropertyGroupComponent
  implements OnChanges
{
  override ngOnChanges() {
    super.ngOnChanges();

    const cssValue = this.css();
    if (cssValue?.display) {
      this.formGroup?.patchValue(cssValue.display, { emitEvent: false });
    }
  }

  override createFormGroup() {
    if (this.formGroupValueChangedSubscription) {
      this.formGroupValueChangedSubscription.unsubscribe();
    }

    const formGroup = this.formBuilder.group({
      display: new FormControl<Property.Display | null | undefined>(null),
    });

    this.formGroupValueChangedSubscription = formGroup.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((value: any) => {
        this.propertiesService.updateCssCategory(this.css(), 'display', value);
      });

    return formGroup;
  }

  protected readonly DisplayOptions = DisplayOptions;
}
