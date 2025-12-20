import {
  Component,
  input,
  OnChanges,
  OnDestroy,
  QueryList,
  ViewChildren,
  inject,
} from '@angular/core';

import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { NumberField } from '../property-components/number-field';
import { PropertiesService } from '../properties.service';

import { Css } from '@layout/canvas';

/**
 * Base component for all property group components.
 * Implements the Presentational Component pattern - delegates all business logic to PropertiesService.
 *
 * Responsibilities:
 * - Form group lifecycle management
 * - Template rendering
 * - Delegating transformations to PropertiesService
 *
 * Non-responsibilities (handled by PropertiesService):
 * - CSS transformations
 * - Value formatting
 * - Canvas updates
 */
@Component({
  selector: 'app-base-app-properties',
  imports: [],
  template: ``,
})
export abstract class BasePropertyGroupComponent
  implements OnChanges, OnDestroy
{
  css = input<Css | undefined>(undefined);
  searchText = input<string>('');
  title = input<string>('');
  mustBeVisible = input<boolean>(false);
  collapsed = input<boolean>(false);

  @ViewChildren(NumberField) panes!: QueryList<NumberField>;

  formGroup: FormGroup;
  formGroupValueChangedSubscription: Subscription | undefined;
  protected destroy$ = new Subject();
  protected formBuilder = inject(FormBuilder);
  protected propertiesService = inject(PropertiesService);

  constructor() {
    this.formGroup = this.createFormGroup();
  }

  ngOnChanges() {
    this.formGroup = this.createFormGroup();
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  protected abstract createFormGroup(): FormGroup<any>;

  getFormControl(name: string) {
    return this.formGroup.get(name) as FormControl;
  }

  protected panelTheme = {
    root: {
      borderColor: 'transparent',
    },
    content: {
      padding: '0px 0px 0px 12px',
    },
    toggleableHeader: {
      padding: '0',
    },
  };
}
