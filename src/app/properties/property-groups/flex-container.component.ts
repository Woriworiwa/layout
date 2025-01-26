import {Component, OnChanges} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, FormControl, ReactiveFormsModule} from "@angular/forms";
import {takeUntil} from "rxjs";
import {Property} from "csstype";
import {DropdownComponent} from "../custom-controls/dropdown.component";
import {SelectButtonComponent} from "../custom-controls/select-button.component";
import {SliderComponent} from "../custom-controls/slider.component";
import {PropertyGroupComponent} from "./property-group.component";
import {AppPropertyFilterPipe} from "../filter.pipe";
import {PanelModule} from "primeng/panel";
import {CanvasService} from "../../canvas/canvas.service";

import {AlignContent, AlignItems, FlexDirection, FlexWrap, JustifyContent} from "../../core/models/css/properties.enum";

@Component({
    selector: 'app-properties-flex-container',
    imports: [CommonModule, ReactiveFormsModule, SelectButtonComponent, SliderComponent, DropdownComponent, AppPropertyFilterPipe, PanelModule],
    template: `
    <ng-container [formGroup]="formGroup">
      <p-panel [header]="title" [toggleable]="true" [collapsed]="false" toggler="header">
        <app-property-item-select-button [options]="flexDirectionOptions"
                                         [control]="getFormControl('flexDirection')"
                                         *ngIf="mustBeVisible || ('flexDirection' | appPropertyFilter: searchText)"
                                         label="Direction"></app-property-item-select-button>

        <app-property-item-slider label="gap"
                                  *ngIf="mustBeVisible || ('gap' | appPropertyFilter: searchText)"
                                  [control]="getFormControl('gap')"></app-property-item-slider>

        <app-property-item-select-button [options]="flexWrapOptions"
                                         [control]="getFormControl('flexWrap')"
                                         *ngIf="mustBeVisible || ('flexWrap' | appPropertyFilter: searchText)"
                                         label="Wrap"></app-property-item-select-button>

        <app-property-item-dropdown [options]="justifyContentOptions"
                                    [control]="getFormControl('justifyContent')"
                                    *ngIf="mustBeVisible || ('justifyContent' | appPropertyFilter: searchText)"
                                    label="justify-content"></app-property-item-dropdown>

        <app-property-item-dropdown [options]="alignItemsOptions"
                                    [control]="getFormControl('alignItems')"
                                    *ngIf="mustBeVisible || ('alignItems' | appPropertyFilter: searchText)"
                                    label="align-items"></app-property-item-dropdown>

        <app-property-item-dropdown [options]="alignContentOptions"
                                    [control]="getFormControl('alignContent')"
                                    *ngIf="mustBeVisible || ('alignContent' | appPropertyFilter: searchText)"
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
export class PropertiesFlexContainerComponent extends PropertyGroupComponent implements OnChanges{

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


  constructor(public fb: FormBuilder,
              protected canvasService: CanvasService,
              private propertyFilter: AppPropertyFilterPipe) {
    super(fb, canvasService, propertyFilter);
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

    const formGroup = this.baseFb.group({
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
        this.baseCanvasService.updateCss({
          ...this.css,
          flexContainer: value
        });
      });

    return formGroup;
  }
}
