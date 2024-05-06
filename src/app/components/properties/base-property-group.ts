import {Component, Input, Output, QueryList, ViewChildren} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Css, Display} from "../../models/css.model";
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {CanvasStore} from "../../store/canvas.store";
import {Property} from "csstype";
import {Subject, Subscription, takeUntil} from "rxjs";
import {SliderComponent} from "./property-items/slider.component";
import {AppPropertyFilterPipe} from "../../pipes/filter.pipe";

@Component({
  selector: 'base-app-properties',
  standalone: true,
  imports: [CommonModule],
  template: `
  `
})
export class BasePropertyGroup {
  @Input() css: Css | undefined;
  @Input() searchText: string = '';
  @Input() title: string = '';
  @Input() mustBeVisible = false;

  @ViewChildren(SliderComponent) panes!: QueryList<SliderComponent>;

  formGroup: FormGroup;
  formGroupValueChangedSubscription: Subscription | undefined;
  protected destroy$ = new Subject();

  constructor(public baseFb: FormBuilder,
              protected baseCanvasStore: CanvasStore,
              private basePropertyFilter: AppPropertyFilterPipe) {
    this.formGroup = this.createFormGroup()!;
  }

  ngOnChanges() {
    this.formGroup = this.createFormGroup()!;

    this.mustBeVisible = this.basePropertyFilter.transform(this.title, this.searchText);
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  protected createFormGroup():  FormGroup<any> | undefined{
    return undefined;
  }

  getFormControl(name: string) {
    return this.formGroup.get(name) as FormControl;
  }
}


