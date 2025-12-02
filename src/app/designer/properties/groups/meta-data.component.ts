import { Component, Input, OnChanges, OnDestroy, inject } from '@angular/core';

import {SettingGroupComponent} from "../components/setting-group.component";
import {FormBuilder, FormControl, ReactiveFormsModule} from "@angular/forms";
import {CanvasService} from "../../../canvas/canvas.service";
import {takeUntil} from "rxjs";
import {PropertyGroupRowComponent} from "../components/property-group-row.component";
import {InputText} from "primeng/inputtext";
import {PropertyGroupComponent} from "../components/property-group.component";
import {PropertiesFilterDirective} from "../properties-filter.directive";

@Component({
  selector: 'app-properties-meta-data',
  imports: [SettingGroupComponent, ReactiveFormsModule, PropertyGroupRowComponent, InputText, PropertiesFilterDirective],
  template: `
    <app-setting-group header="Meta data"
             [toggleable]="true"
             [collapsed]="collapsed">
      <ng-container [formGroup]="formGroup"
                    *appPropertiesFilter="undefined; label: 'label'">
        <app-property-panel-row label="Label">
          <div>
            <input type="text" id="label" pInputText formControlName="label">
          </div>
        </app-property-panel-row>
      </ng-container>
    </app-setting-group>
  `,
  styles: `
    input {
      width: 100%;
    }
  `,
})
export class MetaDataComponent extends PropertyGroupComponent implements OnChanges, OnDestroy {
  @Input() label: string | undefined;

  constructor() {
    const fb = inject(FormBuilder);
    const canvasService = inject(CanvasService);

    super();
  }

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
