import { Component, OnChanges, inject } from '@angular/core';

import {FormBuilder, FormControl, ReactiveFormsModule} from "@angular/forms";
import {takeUntil} from "rxjs";
import {DropdownComponent} from "../../../shared/properties/components/dropdown.component";
import {SliderComponent} from "../../../shared/properties/components/slider.component";
import {PropertyGroupComponent} from "../../../shared/properties/components/property-group.component";
import {SettingGroupComponent} from "../../../shared/properties/components/setting-group.component";
import {CanvasService} from "../../../shared/canvas/canvas.service";


import {AlignSelf, FlexBasis, FlexGrow, FlexShrink, Height} from "../../../core/models/css/properties.enum";
import {FilterDirective} from "../filter.directive";

@Component({
  selector: 'app-properties-flex-item',
  imports: [ReactiveFormsModule, SliderComponent, DropdownComponent, SettingGroupComponent, FilterDirective],
  template: `
    <ng-container [formGroup]="formGroup">
      <app-setting-group [header]="title" [toggleable]="true" [collapsed]="false">
        <app-property-item-slider
          label="flex-grow"
          *appFilter="FlexGrow; cssProperties: filterCssProperties; searchText: searchText; label: 'flex grow'"
          [control]="getFormControl('flexGrow')"
          [suffix]="undefined"
          [max]="5"></app-property-item-slider>

        <app-property-item-slider
          label="flex-shrink"
          *appFilter="FlexShrink; cssProperties: filterCssProperties; searchText: searchText; label: 'flex shrink'"
          [control]="getFormControl('flexShrink')"
          [suffix]="undefined"
          [max]="5"></app-property-item-slider>

        <app-property-item-slider
          label="flex-basis"
          *appFilter="FlexBasis; cssProperties: filterCssProperties; searchText: searchText; label: 'flex basis'"
          [control]="getFormControl('flexBasis')"
          [suffix]="undefined"
          [max]="5"></app-property-item-slider>

        <app-property-item-dropdown
          *appFilter="AlignSelf; cssProperties: filterCssProperties; searchText: searchText; label: 'align self'"
          [options]="alignSelfOptions"
          [control]="getFormControl('alignSelf')"
          label="align-self"></app-property-item-dropdown>
      </app-setting-group>
    </ng-container>
  `,
  styles: `
    :host {
      display: contents;
    }
  `
})
export class PropertiesFlexItemComponent extends PropertyGroupComponent implements OnChanges {
  protected readonly Height = Height;
  protected readonly FlexGrow = FlexGrow;
  protected readonly FlexShrink = FlexShrink;
  protected readonly FlexBasis = FlexBasis;
  protected readonly AlignSelf = AlignSelf;

  /*justify content*/
  alignSelfOptions = [
    AlignSelf.start,
    AlignSelf.end,
    AlignSelf.center,
    AlignSelf.baseline,
    AlignSelf.stretch
  ]

  constructor() {
    const fb = inject(FormBuilder);
    const canvasService = inject(CanvasService);

    super(fb, canvasService);
  }

  override ngOnChanges() {
    super.ngOnChanges();

    if (this.css?.flexItem) {
      this.formGroup?.patchValue(this.css.flexItem, {emitEvent: false});
    }
  }

  protected override createFormGroup() {
    if (this.formGroupValueChangedSubscription) {
      this.formGroupValueChangedSubscription.unsubscribe();
    }

    const formGroup = this.formBuilder.group({
      flexGrow: new FormControl<number | null | undefined>(null, {updateOn: 'blur'}),
      flexShrink: new FormControl<number | null | undefined>(null, {updateOn: 'blur'}),
      flexBasis: new FormControl<number | null | undefined>(null, {updateOn: 'blur'}),
      alignSelf: new FormControl<number | null | undefined>(null, {updateOn: 'blur'}),
    });

    this.formGroupValueChangedSubscription = formGroup.valueChanges
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe((value: any) => {
        this.canvasService.updateCss({
          ...this.css,
          flexItem: value
        });
      });

    return formGroup;
  }
}
