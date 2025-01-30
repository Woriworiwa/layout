import {Component, OnChanges} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, FormControl, ReactiveFormsModule} from "@angular/forms";
import {takeUntil} from "rxjs";
import {Property} from "csstype";
import {DropdownComponent} from "../property-item/dropdown.component";
import {SelectButtonComponent} from "../property-item/select-button.component";
import {SliderComponent} from "../property-item/slider.component";
import {PropertyGroupComponent} from "./property-group.component";
import {PanelModule} from "primeng/panel";
import {CanvasService} from "../../canvas/canvas.service";

import {
  AlignContent,
  AlignItems,
  FlexDirection,
  FlexWrap,
  Gap,
  JustifyContent
} from "../../../core/models/css/properties.enum";
import {FilterDirective} from "../filter.directive";

@Component({
  selector: 'app-properties-flex-container',
  imports: [CommonModule, ReactiveFormsModule, SelectButtonComponent, SliderComponent, DropdownComponent, PanelModule, FilterDirective],
  template: `
    <ng-container [formGroup]="formGroup">
      <p-panel [header]="title" [toggleable]="true" [collapsed]="false" toggler="header">

        <app-property-item-select-button
          *appFilter="FlexDirection; cssProperties: filterCssProperties; searchText: searchText; label: 'direction'"
          [options]="flexDirectionOptions"
          [control]="getFormControl('flexDirection')"
          label="direction"></app-property-item-select-button>

        <app-property-item-slider
          *appFilter="Gap; cssProperties: filterCssProperties; searchText: searchText; label: 'gap'"
          label="gap"
          [control]="getFormControl('gap')"></app-property-item-slider>

        <app-property-item-select-button
          *appFilter="FlexWrap; cssProperties: filterCssProperties; searchText: searchText; label: 'wrap'"
          [options]="flexWrapOptions"
          [control]="getFormControl('flexWrap')"
          label="wrap"></app-property-item-select-button>

        <app-property-item-dropdown
          *appFilter="JustifyContent; cssProperties: filterCssProperties; searchText: searchText; label: 'justify content'"
          [options]="justifyContentOptions"
          [control]="getFormControl('justifyContent')"
          [selectControlsLayout]="selectControlsLayout"
          [label]="'justify-content'"></app-property-item-dropdown>

        <app-property-item-dropdown
          *appFilter="AlignItems; cssProperties: filterCssProperties; searchText: searchText; label: 'align items'"
          [options]="alignItemsOptions"
          [control]="getFormControl('alignItems')"
          label="align-items"></app-property-item-dropdown>

        <app-property-item-dropdown
          *appFilter="AlignContent; cssProperties: filterCssProperties; searchText: searchText; label: 'align content'"
          [options]="alignContentOptions"
          [control]="getFormControl('alignContent')"
          label="align-content"></app-property-item-dropdown>
      </p-panel>
    </ng-container>
  `,
  styles: `
    :host {
      display: contents;
    }
  `
})
export class PropertiesFlexContainerComponent extends PropertyGroupComponent implements OnChanges {
  protected readonly FlexDirection = FlexDirection;
  protected readonly JustifyContent = JustifyContent;
  protected readonly AlignItems = AlignItems;
  protected readonly FlexWrap = FlexWrap;
  protected readonly Gap = Gap;
  protected readonly AlignContent = AlignContent;

  /*direction*/
  flexDirectionOptions = [
    {label: 'Row', value: FlexDirection.row},
    {label: 'Column', value: FlexDirection.column}
  ]

  /*wrap*/
  flexWrapOptions = [
    {label: 'Yes', value: FlexWrap.wrap},
    {label: 'No', value: FlexWrap.nowrap}
  ]

  /*justify content*/
  justifyContentOptions = [
    JustifyContent.center,
    JustifyContent.start,
    JustifyContent.end,
    JustifyContent["space-around"],
    JustifyContent["space-between"],
    JustifyContent["space-evenly"]
  ]

  /*align items*/
  alignItemsOptions = [
    AlignItems.start,
    AlignItems.end,
    AlignItems.center,
    AlignItems.stretch,
    AlignItems.baseline
  ]

  /*align content*/
  alignContentOptions = [
    AlignContent.start,
    AlignContent.end,
    AlignContent.center,
    AlignContent.stretch,
    AlignContent["space-between"],
    AlignContent["space-around"],
    AlignContent["space-evenly"],
    AlignContent.baseline
  ];


  constructor(fb: FormBuilder,
              canvasService: CanvasService) {
    super(fb, canvasService);
  }

  override ngOnChanges() {
    super.ngOnChanges();

    if (this.css?.flexContainer) {
      this.formGroup?.patchValue({
        ...this.css.flexContainer,
        gap: this.css.flexContainer.gap?.toString()
      }, {emitEvent: false});
    }
  }

  override createFormGroup() {
    if (this.formGroupValueChangedSubscription) {
      this.formGroupValueChangedSubscription.unsubscribe();
    }

    const formGroup = this.formBuilder.group({
      flexDirection: new FormControl<Property.FlexDirection | null | undefined>(undefined),
      flexWrap: new FormControl<Property.FlexWrap | null | undefined>(undefined),
      gap: new FormControl<Property.Gap | null | undefined>(null, {updateOn: 'blur'}),
      justifyContent: new FormControl<Property.JustifyContent | null | undefined>(null),
      alignItems: new FormControl<Property.AlignItems | null | undefined>(null),
      alignContent: new FormControl<Property.AlignContent | null | undefined>(null)
    });

    this.formGroupValueChangedSubscription = formGroup.valueChanges
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe((value: any) => {
        this.canvasService.updateCss({
          ...this.css,
          flexContainer: value
        });
      });

    return formGroup;
  }
}
