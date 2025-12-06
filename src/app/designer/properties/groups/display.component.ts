import { Component, OnChanges, inject } from '@angular/core';

import {FormBuilder, FormControl, ReactiveFormsModule} from "@angular/forms";
import {Property} from "csstype";
import {takeUntil} from "rxjs";
import {DropdownComponent} from "../components/dropdown.component";
import {BasePropertyGroupComponent} from "../components/base-property-group.component";
import {PropertyGroupComponent} from "../components/property-group.component";
import {CanvasService} from "../../../canvas/canvas.service";


import {Display, Height} from "../../../core/models/css/properties.enum";
import {PropertiesFilterDirective} from "../properties-filter.directive";
import { PropertyRowComponent } from '../components/property-row.component';

@Component({
  selector: 'app-properties-display',
  imports: [
    ReactiveFormsModule,
    DropdownComponent,
    PropertyGroupComponent,
    PropertiesFilterDirective,
    PropertyRowComponent,
  ],
  template: `
    <app-property-group header="Display" [toggleable]="true" [collapsed]="collapsed">
      <app-property-row label="display"
                        *appPropertiesFilter="Display; label: 'display'">
        <app-property-item-dropdown
          [options]="displayOptions"
          [control]="getFormControl('display')"></app-property-item-dropdown>
      </app-property-row>
    </app-property-group>
  `,
  styles: `
    :host {
      display: contents;
    }
  `,
})
export class DisplayComponent
  extends BasePropertyGroupComponent
  implements OnChanges
{
  protected readonly Height = Height;
  protected readonly Display = Display;
  protected readonly displayOptions = [
    Display.block,
    Display.flex,
    Display.contents,
    Display.flow,
    Display.grid,
    Display.inline,
    Display.none,
  ];

  override ngOnChanges() {
    super.ngOnChanges();

    if (this.css?.display) {
      this.formGroup?.patchValue(this.css.display, { emitEvent: false });
    }
  }

  override createFormGroup() {
    if (this.formGroupValueChangedSubscription) {
      this.formGroupValueChangedSubscription.unsubscribe();
    }

    const formGroup = this.formBuilder.group({
      display: new FormControl<Property.Display | null | undefined>(null),
    });

    this.formGroupValueChangedSubscription = formGroup.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((value: any) => {
        this.canvasService.updateCss({
          ...this.css,
          display: value,
        });
      });

    return formGroup;
  }
}


