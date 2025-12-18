import { Component, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { takeUntil } from 'rxjs';
import { Property } from 'csstype';
import { BasePropertyGroupComponent } from '../components/base-property-group.component';
import { PropertyGroupComponent } from '../components/property-group.component';
import { PropertyRowComponent } from '../components/property-row.component';
import { TextFieldComponent } from '../components/text-field.component';
import { ButtonGroupComponent } from '../components/button-group.component';
import {
  GridAutoFlow,
  JustifyContent,
  AlignItems,
  AlignContent,
  JustifyItems,
} from '../../../core/models/css/properties.enum';
import { NumberField } from '../components/number-field';

@Component({
  selector: 'app-properties-grid-container',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PropertyGroupComponent,
    PropertyRowComponent,
    TextFieldComponent,
    ButtonGroupComponent,
    NumberField,
  ],
  template: `
    <ng-container [formGroup]="formGroup">
      <app-property-group [header]="title()" [toggleable]="true">
        <!-- Grid Template -->
        <app-property-row label="grid-template-columns">
          <app-text-field
            [control]="getFormControl('gridTemplateColumns')"
            [presets]="gridTemplateColumnsPresets"
            placeholder="e.g., 1fr 2fr"
          ></app-text-field>
        </app-property-row>

        <app-property-row label="grid-template-rows">
          <app-text-field
            [control]="getFormControl('gridTemplateRows')"
            [presets]="gridTemplateRowsPresets"
            placeholder="e.g., auto 1fr"
          ></app-text-field>
        </app-property-row>

        <!-- Grid Auto -->
        <app-property-row label="grid-auto-flow">
          <app-button-group
            [options]="gridAutoFlowOptions"
            [control]="getFormControl('gridAutoFlow')"
          ></app-button-group>
        </app-property-row>

        <app-property-row label="grid-auto-columns">
          <app-text-field
            [control]="getFormControl('gridAutoColumns')"
            [presets]="gridAutoSizePresets"
            placeholder="e.g., 1fr"
          ></app-text-field>
        </app-property-row>

        <app-property-row label="grid-auto-rows">
          <app-text-field
            [control]="getFormControl('gridAutoRows')"
            [presets]="gridAutoSizePresets"
            placeholder="e.g., auto"
          ></app-text-field>
        </app-property-row>

        <!-- Alignment (inherited from Container) -->
        <app-property-row label="gap">
          <app-number-field
            [control]="getFormControl('gap')"
          ></app-number-field>
        </app-property-row>

        <app-property-row label="justify-content">
          <app-button-group
            [options]="justifyContentOptions"
            [control]="getFormControl('justifyContent')"
          ></app-button-group>
        </app-property-row>

        <app-property-row label="align-content">
          <app-button-group
            [options]="alignContentOptions"
            [control]="getFormControl('alignContent')"
          ></app-button-group>
        </app-property-row>

        <app-property-row label="justify-items">
          <app-button-group
            [options]="justifyItemsOptions"
            [control]="getFormControl('justifyItems')"
          ></app-button-group>
        </app-property-row>

        <app-property-row label="align-items">
          <app-button-group
            [options]="alignItemsOptions"
            [control]="getFormControl('alignItems')"
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
export class PropertiesGridContainerComponent
  extends BasePropertyGroupComponent
  implements OnChanges
{
  // Grid Template Presets
  gridTemplateColumnsPresets = [
    { label: '1fr', value: '1fr' },
    { label: '2 cols', value: '1fr 1fr' },
    { label: '3 cols', value: 'repeat(3, 1fr)' },
    { label: '4 cols', value: 'repeat(4, 1fr)' },
    { label: 'auto-fit', value: 'repeat(auto-fit, minmax(200px, 1fr))' },
  ];

  gridTemplateRowsPresets = [
    { label: 'auto', value: 'auto' },
    { label: '1fr', value: '1fr' },
    { label: '2 rows', value: 'auto 1fr' },
    { label: '3 rows', value: 'repeat(3, 1fr)' },
  ];

  gridAutoSizePresets = [
    { label: 'auto', value: 'auto' },
    { label: '1fr', value: '1fr' },
    { label: 'min-content', value: 'min-content' },
    { label: 'max-content', value: 'max-content' },
  ];

  // Grid Auto Flow
  gridAutoFlowOptions = [
    { label: 'row', value: GridAutoFlow.row },
    { label: 'column', value: GridAutoFlow.column },
    { label: 'dense', value: GridAutoFlow.dense },
  ];

  // Alignment Options (inherited from Container)
  justifyContentOptions = [
    JustifyContent.start,
    JustifyContent.end,
    JustifyContent.center,
    JustifyContent['space-around'],
    JustifyContent['space-between'],
    JustifyContent['space-evenly'],
  ];

  alignContentOptions = [
    AlignContent.start,
    AlignContent.end,
    AlignContent.center,
    AlignContent.stretch,
    AlignContent['space-around'],
    AlignContent['space-between'],
    AlignContent['space-evenly'],
  ];

  justifyItemsOptions = [
    JustifyItems.start,
    JustifyItems.end,
    JustifyItems.center,
    JustifyItems.stretch,
  ];

  alignItemsOptions = [
    AlignItems.start,
    AlignItems.end,
    AlignItems.center,
    AlignItems.stretch,
    AlignItems.baseline,
  ];

  override ngOnChanges() {
    super.ngOnChanges();

    const cssValue = this.css();
    // Merge container and gridContainer properties
    this.formGroup?.patchValue(
      {
        ...cssValue?.container,
        ...cssValue?.gridContainer,
        gap: cssValue?.container?.gap?.toString(),
      },
      { emitEvent: false }
    );
  }

  override createFormGroup() {
    if (this.formGroupValueChangedSubscription) {
      this.formGroupValueChangedSubscription.unsubscribe();
    }

    const formGroup = this.formBuilder.group({
      gridTemplateColumns: new FormControl<
        Property.GridTemplateColumns | null | undefined
      >(null),
      gridTemplateRows: new FormControl<
        Property.GridTemplateRows | null | undefined
      >(null),
      gridAutoFlow: new FormControl<Property.GridAutoFlow | null | undefined>(
        null
      ),
      gridAutoColumns: new FormControl<
        Property.GridAutoColumns | null | undefined
      >(null),
      gridAutoRows: new FormControl<Property.GridAutoRows | null | undefined>(
        null
      ),
      gap: new FormControl<Property.Gap | null | undefined>(null, {
        updateOn: 'blur',
      }),
      justifyContent: new FormControl<
        Property.JustifyContent | null | undefined
      >(null),
      alignContent: new FormControl<Property.AlignContent | null | undefined>(
        null
      ),
      justifyItems: new FormControl<Property.JustifyItems | null | undefined>(
        null
      ),
      alignItems: new FormControl<Property.AlignItems | null | undefined>(null),
    });

    this.formGroupValueChangedSubscription = formGroup.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((value: any) => {
        // Split into container and grid-specific properties
        const { gap, justifyContent, alignContent, justifyItems, alignItems, ...gridSpecific } = value;

        this.canvasService.updateCss({
          ...this.css(),
          container: {
            gap,
            justifyContent,
            alignContent,
            justifyItems,
            alignItems,
          },
          gridContainer: gridSpecific,
        });
      });

    return formGroup;
  }
}
