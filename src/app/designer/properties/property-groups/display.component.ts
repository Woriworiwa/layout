import { Component, OnChanges } from '@angular/core';
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {Property} from "csstype";
import {takeUntil} from "rxjs";
import {BasePropertyGroupComponent} from "./base-property-group.component";
import {PropertyGroupContainerComponent} from "./property-group-container.component";
import {Display} from "../../../core/models/css/properties.enum";
import { PropertyRowComponent } from '../property-components/property-row.component';
import { ButtonGroupComponent } from '../property-components/button-group.component';

@Component({
  selector: 'app-properties-display',
  imports: [
    ReactiveFormsModule,
    PropertyGroupContainerComponent,
    PropertyRowComponent,
    ButtonGroupComponent,
  ],
  template: `
    <app-property-group header="Display" [toggleable]="true">
      <app-property-row label="display">
        <app-button-group
          [options]="displayOptions"
          [control]="getFormControl('display')"
        ></app-button-group>
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

    const cssValue = this.css();
    if (cssValue?.display) {
      this.formGroup?.patchValue(cssValue.display, { emitEvent: false });
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
        this.propertiesService.updateCssCategory(this.css(), 'display', value);
      });

    return formGroup;
  }
}


