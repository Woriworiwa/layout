import {Component, OnChanges} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Property} from "csstype";
import {FormBuilder, FormControl, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {takeUntil} from "rxjs";
import {InputNumberModule} from "primeng/inputnumber";
import {SliderModule} from "primeng/slider";
import {SliderComponent} from "../property-item/slider.component";
import {AccordionModule} from "primeng/accordion";
import {PropertyGroupComponent} from "./property-group.component";
import {MenuModule} from "primeng/menu";
import {PanelModule} from "primeng/panel";
import {CanvasService} from "../../canvas/canvas.service";

import {Unit} from "../../../core/models/css/unit.enum";
import {Height, Padding, Width} from "../../../core/models/css/properties.enum";
import {FilterDirective} from "../filter.directive";

@Component({
  selector: 'app-properties-box-sizing',
  imports: [CommonModule, InputNumberModule, ReactiveFormsModule, SliderModule, SliderComponent, FormsModule, AccordionModule, MenuModule, PanelModule, FilterDirective],
  template: `
    <p-panel header="Box sizing" [toggleable]="true" [collapsed]="false" toggler="header">
      <ng-container [formGroup]="formGroup">
        <app-property-item-slider
          label="padding"
          *filter="Padding; cssProperties: filterCssProperties; searchText: searchText; label: 'padding'"
          [control]="getFormControl('padding')"
          [unit]="getFormControl('paddingUnit')"></app-property-item-slider>

        <app-property-item-slider
          label="height"
          *filter="Height; cssProperties: filterCssProperties; searchText: searchText; label: 'height'"
          [max]="1000"
          [control]="getFormControl('height')"
          [unit]="getFormControl('heightUnit')"></app-property-item-slider>

        <app-property-item-slider
          label="width"
          *filter="Width; cssProperties: filterCssProperties; searchText: searchText; label: 'width'"
          [max]="1000"
          [control]="getFormControl('width')"
          [unit]="getFormControl('widthUnit')"></app-property-item-slider>
      </ng-container>
    </p-panel>
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

  constructor(fb: FormBuilder,
              canvasService: CanvasService) {
    super(fb, canvasService);
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
