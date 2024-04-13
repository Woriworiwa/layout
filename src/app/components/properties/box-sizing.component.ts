import {Component, Input} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Css} from "../../models/css-models/css.model";
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {CanvasStore} from "../../store/canvas.store";
import {Property} from "csstype";
import {Subject, Subscription, takeUntil} from "rxjs";
import {InputNumberModule} from "primeng/inputnumber";
import {PropertyPanelRowComponent} from "./property-items/property-panel-row.component";
import {SliderModule} from "primeng/slider";

@Component({
  selector: 'app-properties-box-sizing',
  standalone: true,
  imports: [CommonModule, InputNumberModule, PropertyPanelRowComponent, ReactiveFormsModule, SliderModule],
  template: `
    <ng-container [formGroup]="formGroup">
      <app-property-panel-row label="padding">
        <div>
          <p-inputNumber inputId="integeronly" formControlName="padding"></p-inputNumber>
          <p-slider formControlName="padding"></p-slider>
        </div>
      </app-property-panel-row>
    </ng-container>
  `,
  styles: `
    :host {
      display: contents;
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

  private createFormGroup() {
    if (this.formGroupValueChangedSubscription) {
      this.formGroupValueChangedSubscription.unsubscribe();
    }

    const formGroup = this.fb.group({
      padding: new FormControl<Property.Padding | null | undefined>(null)
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
