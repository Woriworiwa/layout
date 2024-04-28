import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {Subject, Subscription, takeUntil} from "rxjs";
import {CanvasStore} from "../../store/canvas.store";
import {Css} from "../../models/css.model";
import {DropdownComponent} from "./property-items/dropdown.component";
import {SelectButtonComponent} from "./property-items/select-button.component";
import {SliderComponent} from "./property-items/slider.component";

@Component({
  selector: 'app-properties-flex-item',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SelectButtonComponent, SliderComponent, DropdownComponent],
  template: `
    <div class="title">Flex item</div>
    <ng-container [formGroup]="formGroup">
      <app-property-item-slider label="flex-grow"
                                [control]="getFormControl('flexGrow')"
                                [suffix]="undefined"
                                [max]="5"></app-property-item-slider>

      <app-property-item-slider label="flex-shrink"
                                [control]="getFormControl('flexShrink')"
                                [suffix]="undefined"
                                [max]="5"></app-property-item-slider>

      <app-property-item-slider label="flex-basis"
                                [control]="getFormControl('flexBasis')"
                                [suffix]="undefined"
                                [max]="5"></app-property-item-slider>
      <app-property-item-slider label="align-self"
                                [control]="getFormControl('alignSelf')"
                                [suffix]="undefined"
                                [max]="5"></app-property-item-slider>
    </ng-container>
  `,
  styles: `
    :host {
      display: contents;
    }
  `
})
export class PropertiesFlexItem {
  @Input() css: Css | undefined;

  formGroup: FormGroup;
  formGroupValueChangedSubscription: Subscription | undefined;

  private destroy$ = new Subject();

  constructor(public fb: FormBuilder,
              protected frameStore: CanvasStore) {
    this.formGroup = this.createFormGroup();
  }

  ngOnChanges() {
    this.formGroup = this.createFormGroup();

    if (this.css?.flexItem) {
      this.formGroup?.patchValue(this.css.flexItem, {emitEvent: false});
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
      flexGrow: new FormControl<number | null | undefined>(null),
      flexShrink: new FormControl<number | null | undefined>(null),
      flexBasis: new FormControl<number | null | undefined>(null),
      alignSelf: new FormControl<number | null | undefined>(null),
    });

    this.formGroupValueChangedSubscription = formGroup.valueChanges
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe((value: any) => {
        this.frameStore.updateCss({
          ...this.css,
          flexItem: value
        });
      });

    return formGroup;
  }
}
