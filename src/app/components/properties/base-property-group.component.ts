import {Component, Input, OnChanges, OnDestroy, QueryList, ViewChildren} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Css} from "../../models/css.model";
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {CanvasStore} from "../../store/canvas.store";
import {Subject, Subscription} from "rxjs";
import {SliderComponent} from "./property-items/slider.component";
import {AppPropertyFilterPipe} from "../../pipes/filter.pipe";

@Component({
  selector: 'app-base-app-properties',
  standalone: true,
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
              protected baseCanvasStore: CanvasStore,
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
}


