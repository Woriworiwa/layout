import { Component, OnChanges, inject } from '@angular/core';

import {FormBuilder, FormControl, ReactiveFormsModule} from "@angular/forms";
import {Property} from "csstype";
import {takeUntil} from "rxjs";
import {DropdownComponent} from "../../../shared/properties/components/dropdown.component";
import {PropertyGroupComponent} from "../../../shared/properties/components/property-group.component";
import {SettingGroupComponent} from "../../../shared/properties/components/setting-group.component";
import {CanvasService} from "../../../shared/canvas/canvas.service";


import {Display, Height} from "../../../core/models/css/properties.enum";
import {FilterDirective} from "../filter.directive";

@Component({
  selector: 'app-properties-display',
  imports: [ReactiveFormsModule, DropdownComponent, SettingGroupComponent, FilterDirective],
  template: `
    <app-setting-group header="Display" [toggleable]="true" [collapsed]="collapsed">
      <app-property-item-dropdown
        *appFilter="Display; cssProperties: filterCssProperties; searchText: searchText; label: 'display'"
        [options]="displayOptions"
        [control]="getFormControl('display')"
        label="display"></app-property-item-dropdown>
    </app-setting-group>
  `,
  styles: `
    :host {
      display: contents;
    }
  `
})
export class DisplayComponent extends PropertyGroupComponent implements OnChanges {
  protected readonly Height = Height;
  protected readonly Display = Display;
  protected readonly displayOptions = [
    Display.block,
    Display.flex,
    Display.contents,
    Display.flow,
    Display.grid,
    Display.inline,
    Display.none
  ];

  constructor() {
    const fb = inject(FormBuilder);
    const canvasService = inject(CanvasService);

    super(fb, canvasService);
  }

  override ngOnChanges() {
    super.ngOnChanges();

    if (this.css?.display) {
      this.formGroup?.patchValue(this.css.display, {emitEvent: false});
    }
  }


  override createFormGroup() {
    if (this.formGroupValueChangedSubscription) {
      this.formGroupValueChangedSubscription.unsubscribe();
    }

    const formGroup = this.formBuilder.group({
      display: new FormControl<Property.Display | null | undefined>(null)
    });

    this.formGroupValueChangedSubscription = formGroup.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((value: any) => {
        this.canvasService.updateCss({
          ...this.css,
          display: value
        });
      });

    return formGroup;
  }
}


