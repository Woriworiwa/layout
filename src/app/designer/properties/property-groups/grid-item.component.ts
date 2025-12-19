import { Component, OnChanges } from '@angular/core';

import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { takeUntil } from 'rxjs';
import { Property } from 'csstype';
import { BasePropertyGroupComponent } from './base-property-group.component';
import { PropertyGroupContainerComponent } from './property-group-container.component';
import { PropertyRowComponent } from '../property-components/property-row.component';
import { TextFieldComponent } from '../property-components/text-field.component';
import { ButtonGroupComponent } from '../property-components/button-group.component';
import {
  AlignSelfOptions,
  JustifySelfOptions,
} from '../../../core/models/css-enums/properties.enum';

@Component({
  selector: 'app-properties-grid-item',
  imports: [
    ReactiveFormsModule,
    PropertyGroupContainerComponent,
    PropertyRowComponent,
    TextFieldComponent,
    ButtonGroupComponent
],
  template: `
    <ng-container [formGroup]="formGroup">
      <app-property-group [header]="title()" [toggleable]="true">
        <app-property-row label="grid-column">
          <app-text-field
            [control]="getFormControl('gridColumn')"
            [presets]="gridColumnPresets"
            placeholder="e.g., 1 / 3, span 2"
          ></app-text-field>
        </app-property-row>

        <app-property-row label="grid-row">
          <app-text-field
            [control]="getFormControl('gridRow')"
            [presets]="gridRowPresets"
            placeholder="e.g., 1 / 2, span 1"
          ></app-text-field>
        </app-property-row>

        <app-property-row label="justify-self">
          <app-button-group
            [options]="JustifySelfOptions"
            [control]="getFormControl('justifySelf')"
          ></app-button-group>
        </app-property-row>

        <app-property-row label="align-self">
          <app-button-group
            [options]="AlignSelfOptions"
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
export class PropertiesGridItemComponent extends BasePropertyGroupComponent implements OnChanges {
  gridColumnPresets = [
    { label: 'span 1', value: 'span 1' },
    { label: 'span 2', value: 'span 2' },
    { label: 'span 3', value: 'span 3' },
    { label: '1 / -1', value: '1 / -1' },
  ];

  gridRowPresets = [
    { label: 'span 1', value: 'span 1' },
    { label: 'span 2', value: 'span 2' },
    { label: 'span 3', value: 'span 3' },
    { label: '1 / -1', value: '1 / -1' },
  ];

  override ngOnChanges() {
    super.ngOnChanges();

    const cssValue = this.css();
    if (cssValue?.gridItem) {
      this.formGroup?.patchValue(cssValue.gridItem, { emitEvent: false });
    }
  }

  override createFormGroup() {
    if (this.formGroupValueChangedSubscription) {
      this.formGroupValueChangedSubscription.unsubscribe();
    }

    const formGroup = this.formBuilder.group({
      gridColumn: new FormControl<Property.GridColumn | null | undefined>(null),
      gridRow: new FormControl<Property.GridRow | null | undefined>(null),
      justifySelf: new FormControl<Property.JustifySelf | null | undefined>(null),
      alignSelf: new FormControl<Property.AlignSelf | null | undefined>(null),
    });

    this.formGroupValueChangedSubscription = formGroup.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((value: any) => {
        this.propertiesService.updateCssCategory(this.css(), 'gridItem', value);
      });

    return formGroup;
  }

  protected readonly JustifySelfOptions = JustifySelfOptions;
  protected readonly AlignSelfOptions = AlignSelfOptions;
}
