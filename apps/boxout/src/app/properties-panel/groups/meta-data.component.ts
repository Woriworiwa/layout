import { Component, input, OnChanges, OnDestroy, effect } from '@angular/core';

import { PropertyGroupContainerComponent } from './property-group-container.component';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { takeUntil } from 'rxjs';
import { PropertyRowComponent } from '../components/property-row.component';
import { InputText } from 'primeng/inputtext';
import { BasePropertyGroupComponent } from './base-property-group.component';

@Component({
  selector: 'app-properties-meta-data',
  imports: [
    PropertyGroupContainerComponent,
    ReactiveFormsModule,
    PropertyRowComponent,
    InputText,
  ],
  template: `
    <app-property-group header="Meta data" [toggleable]="true">
      <ng-container [formGroup]="formGroup">
        <app-property-row label="Label">
          <div>
            <input type="text" id="label" pInputText formControlName="label" />
          </div>
        </app-property-row>
      </ng-container>
    </app-property-group>
  `,
  styles: `
    input {
      width: 100%;
    }
  `,
})
export class MetaDataComponent
  extends BasePropertyGroupComponent
  implements OnChanges, OnDestroy
{
  label = input<string | undefined>(undefined);

  constructor() {
    super();
    effect(() => {
      this.formGroup?.patchValue({ label: this.label() }, { emitEvent: false });
    });
  }

  override ngOnChanges() {
    super.ngOnChanges();
  }

  override createFormGroup() {
    if (this.formGroupValueChangedSubscription) {
      this.formGroupValueChangedSubscription.unsubscribe();
    }

    const formGroup = this.formBuilder.group({
      label: new FormControl<string | null | undefined>(null, {
        updateOn: 'blur',
      }),
    });

    this.formGroupValueChangedSubscription = formGroup.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        this.propertiesService.renameSelectedItem(value.label || '');
      });

    return formGroup;
  }
}
