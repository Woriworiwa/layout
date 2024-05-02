import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {Subject, Subscription, takeUntil} from "rxjs";
import {CanvasStore} from "../../store/canvas.store";
import {Property} from "csstype";
import {
  AlignContent,
  AlignItems,
  FlexDirection,
  FlexWrap,
  JustifyContent
} from "../../models/css.model";
import {Css} from "../../models/css.model";
import {DropdownComponent} from "./property-items/dropdown.component";
import {SelectButtonComponent} from "./property-items/select-button.component";
import {SliderComponent} from "./property-items/slider.component";

@Component({
  selector: 'app-properties-flex-container',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SelectButtonComponent, SliderComponent, DropdownComponent],
  template: `
    <ng-container [formGroup]="formGroup">
      <app-property-item-select-button [options]="flexDirectionOptions"
                                       [control]="getFormControl('flexDirection')"
                                       label="Direction"></app-property-item-select-button>

      <app-property-item-slider label="gap"
                                [control]="getFormControl('gap')"></app-property-item-slider>

      <app-property-item-select-button [options]="flexWrapOptions"
                                       [control]="getFormControl('flexWrap')"
                                       label="Wrap"></app-property-item-select-button>

      <app-property-item-dropdown [options]="justifyContentOptions"
                         [control]="getFormControl('justifyContent')"
                         label="justify-content"></app-property-item-dropdown>

      <app-property-item-dropdown [options]="alignItemsOptions"
                         [control]="getFormControl('alignItems')"
                         label="align-items"></app-property-item-dropdown>

      <app-property-item-dropdown [options]="alignContentOptions"
                                  [control]="getFormControl('alignContent')"
                                  label="align-content"></app-property-item-dropdown>
    </ng-container>
  `,
  styles: `
    :host {
      display: contents;
    }
  `
})
export class PropertiesFlexConainer {
  @Input() css: Css | undefined;

  /*direction*/
  flexDirectionOptions = [
    {label: 'Row', value: FlexDirection.row},
    {label: 'Column', value: FlexDirection.column}
  ]

  /*wrap*/
  flexWrapOptions = [
    {label: 'Yes', value: FlexWrap.wrap},
    {label: 'No', value: FlexWrap.nowrap}
  ]

  /*justify content*/
  justifyContentOptions = [
    JustifyContent.center,
    JustifyContent.start,
    JustifyContent.end,
    JustifyContent["space-around"],
    JustifyContent["space-between"],
    JustifyContent["space-evenly"]
  ]

  /*align items*/
  alignItemsOptions = [
    AlignItems.start,
    AlignItems.end,
    AlignItems.center,
    AlignItems.stretch,
    AlignItems.baseline
  ]

  /*align content*/
  alignContentOptions = [
    AlignContent.start,
    AlignContent.end,
    AlignContent.center,
    AlignContent.stretch,
    AlignContent["space-between"],
    AlignContent["space-around"],
    AlignContent["space-evenly"],
    AlignContent.baseline
  ];

  formGroup: FormGroup;
  formGroupValueChangedSubscription: Subscription | undefined;

  private destroy$ = new Subject();

  constructor(public fb: FormBuilder,
              protected frameStore: CanvasStore) {
    this.formGroup = this.createFormGroup();
  }

  ngOnChanges() {
    this.formGroup = this.createFormGroup();

    if (this.css?.flexContainer) {
      this.formGroup?.patchValue({
        ...this.css.flexContainer,
        gap: this.css.flexContainer.gap?.toString()
      }, {emitEvent: false});
    }
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  getFormControl(name: string) {
    return this.formGroup.get(name) as FormControl;
  }

  private createFormGroup() {
    if (this.formGroupValueChangedSubscription) {
      this.formGroupValueChangedSubscription.unsubscribe();
    }

    const formGroup = this.fb.group({
      flexDirection: new FormControl<Property.FlexDirection | null | undefined>(undefined),
      flexWrap: new FormControl<Property.FlexWrap | null | undefined>(undefined),
      gap: new FormControl<Property.Gap | null | undefined>(null),
      justifyContent: new FormControl<Property.JustifyContent | null | undefined>(null),
      alignItems: new FormControl<Property.AlignItems | null | undefined>(null),
      alignContent: new FormControl<Property.AlignContent | null | undefined>(null)
    });

    this.formGroupValueChangedSubscription = formGroup.valueChanges
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe((value: any) => {
        this.frameStore.updateCss({
          ...this.css,
          flexContainer: value
        });
      });

    return formGroup;
  }
}
