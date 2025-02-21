import {Component, Input, OnChanges, OnDestroy, QueryList, ViewChildren} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {Subject, Subscription} from "rxjs";
import {SliderComponent} from "../form-items/slider.component";
import {CanvasService} from "../../canvas/canvas.service";

import {Css} from "../../../core/models/css/css";
import {Unit} from "../../../core/models/css/unit.enum";

@Component({
  selector: 'app-base-app-properties',
  imports: [CommonModule],
  template: `
  `
})
export abstract class PropertyGroupComponent implements OnChanges, OnDestroy {
  @Input() css: Css | undefined;
  @Input() searchText = '';
  @Input() title = '';
  @Input() mustBeVisible = false;
  @Input() filterCssProperties: any[] = [];

  @ViewChildren(SliderComponent) panes!: QueryList<SliderComponent>;

  formGroup: FormGroup;
  formGroupValueChangedSubscription: Subscription | undefined;
  protected destroy$ = new Subject();

  protected constructor(protected formBuilder: FormBuilder,
                        protected canvasService: CanvasService) {
    this.formGroup = this.createFormGroup();
  }

  ngOnChanges() {
    this.formGroup = this.createFormGroup();
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  protected abstract createFormGroup(): FormGroup<any>

  getFormControl(name: string) {
    return this.formGroup.get(name) as FormControl;
  }

  protected extractValue(postFixedValue: any) {
    return postFixedValue?.toString().replace(/\D/g, '')
  }

  protected extractUnit(postFixedValue: any) {
    return postFixedValue?.toString().replace(/[0-9]/g, '') || Unit.px
  }
}


