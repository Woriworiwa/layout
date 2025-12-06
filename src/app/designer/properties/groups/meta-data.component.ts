import { Component, Input, OnChanges, OnDestroy, inject } from '@angular/core';

import {PropertyGroupComponent} from "../components/property-group.component";
import {FormBuilder, FormControl, ReactiveFormsModule} from "@angular/forms";
import {CanvasService} from "../../../canvas/canvas.service";
import {takeUntil} from "rxjs";
import {PropertyRowComponent} from "../components/property-row.component";
import {InputText} from "primeng/inputtext";
import {BasePropertyGroupComponent} from "../components/base-property-group.component";
import {PropertiesFilterDirective} from "../properties-filter.directive";

@Component({
  selector: 'app-properties-meta-data',
  imports: [PropertyGroupComponent, ReactiveFormsModule, PropertyRowComponent, InputText, PropertiesFilterDirective],
  template: `
    <app-property-group header="Meta data"
             [toggleable]="true"
             [collapsed]="collapsed">
      <ng-container [formGroup]="formGroup"
                    *appPropertiesFilter="undefined; label: 'label'">
        <app-property-row label="Label">
          <div>
            <input type="text" id="label" pInputText formControlName="label">
          </div>
        </app-property-row>
      </ng-container>
    </app-property-group>
  `,
  styles: `
    input {
      width: 100%;
    }
  `,
})
export class MetaDataComponent extends BasePropertyGroupComponent implements OnChanges, OnDestroy {
  @Input() label: string | undefined;

  override ngOnChanges() {
    super.ngOnChanges();

    this.formGroup?.patchValue({label: this.label}, {emitEvent: false});
  }

  override createFormGroup() {
    if (this.formGroupValueChangedSubscription) {
      this.formGroupValueChangedSubscription.unsubscribe();
    }

    const formGroup = this.formBuilder.group({
      label: new FormControl<string | null | undefined>(null, {updateOn: 'blur'}),
    });

    this.formGroupValueChangedSubscription = formGroup.valueChanges
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe((value: any) => {
        this.canvasService.renameItem(value.label);
      });

    return formGroup;
  }
}
