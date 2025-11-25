import {Component, Input, OnChanges, OnDestroy, QueryList, ViewChildren, inject} from '@angular/core';

import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {Subject, Subscription} from "rxjs";
import {SliderComponent} from "./slider.component";
import {CanvasService} from "../../../canvas/canvas.service";

import {Css} from "../../../core/models/css/css";
import {Unit} from "../../../core/models/css/unit.enum";

@Component({
  selector: 'app-base-app-properties',
  imports: [],
  template: `
  `
})
export abstract class PropertyGroupComponent implements OnChanges, OnDestroy {
  @Input() css: Css | undefined;
  @Input() searchText = '';
  @Input() title = '';
  @Input() mustBeVisible = false;
  @Input() filterCssProperties: any[] = [];
  @Input() collapsed = false;

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

  protected panelTheme = {
    root:{
      borderColor: 'transparent'
    },
    content: {
      padding: '0px 0px 0px 12px'
    },
    toggleableHeader: {
      padding: '0',
    }
  }
}


