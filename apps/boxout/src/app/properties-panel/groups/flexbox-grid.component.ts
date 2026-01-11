import { Component, inject, OnChanges } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { takeUntil } from 'rxjs';
import { Property } from 'csstype';
import { ButtonGroupComponent } from '../components/button-group.component';
import { NumberField } from '../components/number-field';
import { BasePropertyGroupComponent } from './base-property-group.component';
import { PropertyGroupComponent } from './property-group.component';
import {
  AlignContentOptions,
  AlignItemsOptions,
  AlignSelfOptions,
  FlexDirectionOptions,
  FlexWrapOptions,
  GridAutoFlowOptions,
  JustifyContentOptions,
  JustifyItemsOptions,
  JustifySelfOptions,
} from '@layout/models';
import { PropertyRowComponent } from '../components/property-row.component';
import { TextFieldComponent } from '../components/text-field.component';
import { TextAreaFieldComponent } from '../components/text-area-field.component';
import { CanvasService } from '@layout/canvas';

@Component({
  selector: 'app-properties-flexbox-grid',
  imports: [
    ReactiveFormsModule,
    ButtonGroupComponent,
    NumberField,
    PropertyGroupComponent,
    PropertyRowComponent,
    TextFieldComponent,
    TextAreaFieldComponent,
  ],
  template: `
    <ng-container [formGroup]="formGroup">
      <app-property-group
        [header]="title()"
        [toggleable]="true"
        [collapsed]="collapsed()"
        groupId="flexbox-grid"
      >
        <!-- FlexboxGrid Properties -->
        <app-property-row label="gap">
          <app-number-field
            [control]="getFormControl('gap')"
          ></app-number-field>
        </app-property-row>

        <!-- Flex Container Properties -->
        <app-property-row label="flex-direction">
          <app-button-group
            [options]="FlexDirectionOptions"
            [control]="getFormControl('flexDirection')"
          ></app-button-group>
        </app-property-row>

        <app-property-row label="flex-wrap">
          <app-button-group
            [options]="FlexWrapOptions"
            [control]="getFormControl('flexWrap')"
          ></app-button-group>
        </app-property-row>

        <!-- Grid Container Properties -->
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

        <app-property-row label="grid-template-areas">
          <app-text-area-field
            [control]="getFormControl('gridTemplateAreas')"
            [presets]="gridTemplateAreasPresets"
            [rows]="3"
            placeholder='e.g., "header header"&#10;"sidebar main"'
          ></app-text-area-field>
        </app-property-row>

        <app-property-row label="grid-auto-flow">
          <app-button-group
            [options]="GridAutoFlowOptions"
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

        <!-- Shared Alignment Properties -->
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

        <app-property-row label="justify-items">
          <app-button-group
            [options]="JustifyItemsOptions"
            [control]="getFormControl('justifyItems')"
          ></app-button-group>
        </app-property-row>

        <!-- Flex Item Properties -->
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

        <!-- Grid Item Properties -->
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

        <app-property-row label="grid-area">
          <app-text-field
            [control]="getFormControl('gridArea')"
            [presets]="gridAreaPresets"
            placeholder="e.g., header, main"
          ></app-text-field>
        </app-property-row>

        <!-- Shared Self Alignment -->
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
export class PropertiesFlexboxGridComponent
  extends BasePropertyGroupComponent
  implements OnChanges
{
  private canvasService = inject(CanvasService);

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

  gridTemplateAreasPresets = [
    {
      label: 'Blog Layout',
      value: '"header header"\n"content sidebar"\n"footer footer"',
    },
    {
      label: 'Magazine',
      value:
        '"header header header"\n"featured featured sidebar"\n"article1 article2 sidebar"\n"footer footer footer"',
    },
    {
      label: 'Dashboard',
      value: '"header header"\n"sidebar main"\n"sidebar main"',
    },
    {
      label: 'Holy Grail',
      value: '"header header header"\n"nav main aside"\n"footer footer footer"',
    },
    {
      label: 'App Shell',
      value:
        '"header header header"\n"nav main aside"\n"nav main aside"\n"footer footer footer"',
    },
  ];

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

  gridAreaPresets = [
    { label: 'header', value: 'header' },
    { label: 'nav', value: 'nav' },
    { label: 'main', value: 'main' },
    { label: 'content', value: 'content' },
    { label: 'sidebar', value: 'sidebar' },
    { label: 'aside', value: 'aside' },
    { label: 'footer', value: 'footer' },
    { label: 'featured', value: 'featured' },
    { label: 'article1', value: 'article1' },
    { label: 'article2', value: 'article2' },
  ];

  override ngOnChanges() {
    super.ngOnChanges();

    // All layout properties are now in the flexboxGrid category
    const flexboxGridValues = this.propertiesService.getFlexboxGridPropsForForm(
      this.css(),
      { gap: (val) => val?.toString() },
    );

    this.formGroup?.patchValue(flexboxGridValues, { emitEvent: false });
  }

  override createFormGroup() {
    if (this.formGroupValueChangedSubscription) {
      this.formGroupValueChangedSubscription.unsubscribe();
    }

    const formGroup = this.formBuilder.group({
      // FlexboxGrid properties (shared + flex + grid)
      gap: new FormControl<Property.Gap | null | undefined>(null, {
        updateOn: 'blur',
      }),
      flexDirection: new FormControl<Property.FlexDirection | null | undefined>(
        undefined,
      ),
      flexWrap: new FormControl<Property.FlexWrap | null | undefined>(
        undefined,
      ),
      gridTemplateColumns: new FormControl<
        Property.GridTemplateColumns | null | undefined
      >(null),
      gridTemplateRows: new FormControl<
        Property.GridTemplateRows | null | undefined
      >(null),
      gridTemplateAreas: new FormControl<
        Property.GridTemplateAreas | null | undefined
      >(null),
      gridAutoFlow: new FormControl<Property.GridAutoFlow | null | undefined>(
        null,
      ),
      gridAutoColumns: new FormControl<
        Property.GridAutoColumns | null | undefined
      >(null),
      gridAutoRows: new FormControl<Property.GridAutoRows | null | undefined>(
        null,
      ),
      justifyContent: new FormControl<
        Property.JustifyContent | null | undefined
      >(null),
      alignItems: new FormControl<Property.AlignItems | null | undefined>(null),
      alignContent: new FormControl<Property.AlignContent | null | undefined>(
        null,
      ),
      justifyItems: new FormControl<Property.JustifyItems | null | undefined>(
        null,
      ),
      // Flex Item properties
      flexGrow: new FormControl<number | null | undefined>(null, {
        updateOn: 'blur',
      }),
      flexShrink: new FormControl<number | null | undefined>(null, {
        updateOn: 'blur',
      }),
      flexBasis: new FormControl<number | null | undefined>(null, {
        updateOn: 'blur',
      }),
      // Grid Item properties
      gridColumn: new FormControl<Property.GridColumn | null | undefined>(null),
      gridRow: new FormControl<Property.GridRow | null | undefined>(null),
      gridArea: new FormControl<Property.GridArea | null | undefined>(null),
      justifySelf: new FormControl<Property.JustifySelf | null | undefined>(
        null,
      ),
      // Shared self alignment
      alignSelf: new FormControl<Property.AlignSelf | null | undefined>(null),
    });

    this.formGroupValueChangedSubscription = formGroup.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        // All layout properties are now in the flexboxGrid category
        // Filter out null values (convert to undefined for FlexboxGrid type)
        const flexboxGridProps: Record<string, unknown> = {};
        Object.entries(value).forEach(([key, val]) => {
          if (val !== null) {
            flexboxGridProps[key] = val;
          }
        });

        this.canvasService.updateCss({
          ...this.css(),
          flexboxGrid: flexboxGridProps,
        });
      });

    return formGroup;
  }

  protected readonly JustifyContentOptions = JustifyContentOptions;
  protected readonly AlignItemsOptions = AlignItemsOptions;
  protected readonly AlignContentOptions = AlignContentOptions;
  protected readonly JustifyItemsOptions = JustifyItemsOptions;
  protected readonly FlexDirectionOptions = FlexDirectionOptions;
  protected readonly FlexWrapOptions = FlexWrapOptions;
  protected readonly GridAutoFlowOptions = GridAutoFlowOptions;
  protected readonly JustifySelfOptions = JustifySelfOptions;
  protected readonly AlignSelfOptions = AlignSelfOptions;
}
