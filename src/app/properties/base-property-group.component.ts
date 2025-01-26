import {Component, Input, OnChanges, OnDestroy, QueryList, ViewChildren} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Css, Unit} from "../core/models/css.model";
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {Subject, Subscription} from "rxjs";
import {SliderComponent} from "./property-items/slider.component";
import {AppPropertyFilterPipe} from "./filter.pipe";
import {CanvasService} from "../canvas/canvas.service";

@Component({
    selector: 'app-base-app-properties',
    imports: [CommonModule],
    template: `
  `
})
export abstract class BasePropertyGroupComponent implements OnChanges, OnDestroy {
  @Input() css: Css | undefined;
  @Input() searchText = '';
  @Input() title = '';
  @Input() mustBeVisible = false;

  @ViewChildren(SliderComponent) panes!: QueryList<SliderComponent>;

  formGroup: FormGroup;
  formGroupValueChangedSubscription: Subscription | undefined;
  protected destroy$ = new Subject();

  protected constructor(public baseFb: FormBuilder,
              protected baseCanvasService: CanvasService,
              private basePropertyFilter: AppPropertyFilterPipe) {
    this.formGroup = this.createFormGroup();
  }

  ngOnChanges() {
    this.formGroup = this.createFormGroup();

    this.mustBeVisible = this.basePropertyFilter.transform(this.title, this.searchText);
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  protected abstract createFormGroup():  FormGroup<any>

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


