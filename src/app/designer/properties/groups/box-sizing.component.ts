import { Component, OnChanges, inject } from '@angular/core';

import {Property} from "csstype";
import {FormBuilder, FormControl, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {takeUntil} from "rxjs";
import {SliderComponent} from "../components/slider.component";
import {PropertyGroupComponent} from "../components/property-group.component";
import {SettingGroupComponent} from "../components/setting-group.component";
import {CanvasService} from "../../../canvas/canvas.service";

import {Unit} from "../../../core/models/css/unit.enum";
import {Height, Padding, Width} from "../../../core/models/css/properties.enum";
import {FilterDirective} from "../filter.directive";

@Component({
  selector: 'app-properties-box-sizing',
  imports: [ReactiveFormsModule, SliderComponent, FormsModule, SettingGroupComponent, FilterDirective],
  template: `
    <app-setting-group header="Box sizing" [toggleable]="true" [collapsed]="collapsed">
      <ng-container [formGroup]="formGroup">
        <app-property-item-slider
          label="padding"
          *appFilter="Padding; cssProperties: filterCssProperties; searchText: searchText; label: 'padding'"
          [control]="getFormControl('padding')"
          [unit]="getFormControl('paddingUnit')"></app-property-item-slider>

        <app-property-item-slider
          label="height"
          *appFilter="Height; cssProperties: filterCssProperties; searchText: searchText; label: 'height'"
          [max]="1000"
          [control]="getFormControl('height')"
          [unit]="getFormControl('heightUnit')"></app-property-item-slider>

        <app-property-item-slider
          label="width"
          *appFilter="Width; cssProperties: filterCssProperties; searchText: searchText; label: 'width'"
          [max]="1000"
          [control]="getFormControl('width')"
          [unit]="getFormControl('widthUnit')"></app-property-item-slider>
      </ng-container>
    </app-setting-group>
  `,
  styles: `
    :host {
      display: contents;

      app-property-panel-row {
        margin-left: 20px;
      }
    }
  `
})
export class BoxSizingComponent extends PropertyGroupComponent implements OnChanges {
  protected readonly Padding = Padding;
  protected readonly Height = Height;
  protected readonly Width = Width;

  items: { label?: string; icon?: string; separator?: boolean }[] = [];

  constructor() {
    const fb = inject(FormBuilder);
    const canvasService = inject(CanvasService);

    super();
  }

  override ngOnChanges() {
    super.ngOnChanges();

    if (!this.css?.boxSizing) {
      return;
    }

    this.formGroup?.patchValue({
      padding: this.extractValue(this.css.boxSizing.padding),
      paddingUnit: this.extractUnit(this.css.boxSizing.padding),
      height: this.extractValue(this.css.boxSizing.height),
      heightUnit: this.extractUnit(this.css.boxSizing.height),
      width: this.extractValue(this.css.boxSizing.width),
      widthUnit: this.extractUnit(this.css.boxSizing.width)
    }, {emitEvent: false});

  }

  protected override createFormGroup() {
    if (this.formGroupValueChangedSubscription) {
      this.formGroupValueChangedSubscription.unsubscribe();
    }

    const formGroup = this.formBuilder.group({
      padding: new FormControl<Property.Padding | null | undefined>(null, {updateOn: 'blur'}),
      paddingUnit: new FormControl<Unit>(Unit.px),
      height: new FormControl<Property.Height | null | undefined>(null, {updateOn: 'blur'}),
      heightUnit: new FormControl<Unit>(Unit.px),
      width: new FormControl<Property.Height | null | undefined>(null, {updateOn: 'blur'}),
      widthUnit: new FormControl<Unit>(Unit.px)
    });

    this.formGroupValueChangedSubscription = formGroup.valueChanges
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe((value: any) => {
        this.canvasService.updateCss({
          ...this.css,
          boxSizing: {
            height: value.height != null ? `${value.height}${value.heightUnit}` : value.height,
            padding: value.padding != null ? `${value.padding}${value.paddingUnit}` : value.padding,
            width: value.width != null ? `${value.width}${value.widthUnit}` : value.width
          }
        });
      });

    return formGroup;
  }
}
