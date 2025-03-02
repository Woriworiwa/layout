import {Component, Input, OnChanges, OnDestroy} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Panel} from "primeng/panel";
import {FormBuilder, FormControl, ReactiveFormsModule} from "@angular/forms";
import {CanvasService} from "../../canvas/canvas.service";
import {takeUntil} from "rxjs";
import {PropertyGroupRowComponent} from "../form-items/property-group-row.component";
import {InputText} from "primeng/inputtext";
import {PropertyGroupComponent} from "./property-group.component";
import {FilterDirective} from "../filter.directive";

@Component({
  selector: 'app-properties-meta-data',
  imports: [CommonModule, Panel, ReactiveFormsModule, PropertyGroupRowComponent, InputText, FilterDirective],
  template: `
    <p-panel header="Meta data"
             [toggleable]="true"
             [collapsed]="collapsed"
             toggler="header">
      <ng-container [formGroup]="formGroup"
                    *appFilter="undefined; cssProperties: filterCssProperties; searchText: searchText; label: 'label'">
        <app-property-panel-row label="Label">
          <div>
            <input type="text" id="label" pInputText formControlName="label">
          </div>
        </app-property-panel-row>
      </ng-container>
    </p-panel>
  `,
  styles: `
    input {
      width: 100%;
    }
  `,
})
export class MetaDataComponent extends PropertyGroupComponent implements OnChanges, OnDestroy {
  @Input() label: string | undefined;

  constructor(fb: FormBuilder,
              canvasService: CanvasService) {
    super(fb, canvasService);
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
