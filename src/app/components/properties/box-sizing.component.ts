import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Css} from "../../models/css.model";
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CanvasStore} from "../../store/canvas.store";
import {Property} from "csstype";
import {Subject, Subscription, takeUntil} from "rxjs";
import {InputNumberModule} from "primeng/inputnumber";
import {PropertyPanelRowComponent} from "./property-items/property-panel-row.component";
import {SliderModule} from "primeng/slider";
import {SliderComponent} from "./property-items/slider.component";

@Component({
  selector: 'app-properties-box-sizing',
  standalone: true,
  imports: [CommonModule, InputNumberModule, PropertyPanelRowComponent, ReactiveFormsModule, SliderModule, SliderComponent, FormsModule],
  template: `
    <div class="title">Box sizing</div>

    <ng-container [formGroup]="formGroup">
      <app-property-item-slider label="padding"
                                [control]="getFormControl('padding')"></app-property-item-slider>

      <app-property-item-slider label="height"
                                [max]="1000"
                                [control]="getFormControl('height')"></app-property-item-slider>

      <app-property-item-slider label="width"
                                [max]="1000"
                                [control]="getFormControl('width')"></app-property-item-slider>
    </ng-container>
  `,
  styles: `
    :host {
      display: contents;

      app-property-panel-row {
        margin-left: 20px;
      }
    }
  `
})
export class BoxSizingComponent {
  @Input() css: Css | undefined;

  formGroup: FormGroup;
  formGroupValueChangedSubscription: Subscription | undefined;

  private destroy$ = new Subject();

  constructor(public fb: FormBuilder,
              protected canvasStore: CanvasStore) {
    this.formGroup = this.createFormGroup();
  }

  ngOnChanges() {
    this.formGroup = this.createFormGroup();

    if (this.css?.boxSizing) {
      this.formGroup?.patchValue({
        ...this.css.boxSizing
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
      padding: new FormControl<Property.Padding | null | undefined>(null),
      height: new FormControl<Property.Height | null | undefined>(null),
      width: new FormControl<Property.Height | null | undefined>(null)
    });

    this.formGroupValueChangedSubscription = formGroup.valueChanges
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe((value: any) => {
        this.canvasStore.updateCss({
          ...this.css,
          boxSizing: value
        });
      });

    return formGroup;
  }
}
