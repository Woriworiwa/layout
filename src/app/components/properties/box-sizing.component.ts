import {Component, OnChanges} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Property} from "csstype";
import {FormBuilder, FormControl, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CanvasStore} from "../../store/canvas.store";
import {takeUntil} from "rxjs";
import {InputNumberModule} from "primeng/inputnumber";
import {PropertyPanelRowComponent} from "./property-items/property-panel-row.component";
import {SliderModule} from "primeng/slider";
import {SliderComponent} from "./property-items/slider.component";
import {AccordionModule} from "primeng/accordion";
import {BasePropertyGroupComponent} from "./base-property-group.component";
import {AppPropertyFilterPipe} from "../../pipes/filter.pipe";
import {MenuModule} from "primeng/menu";
import {PanelModule} from "primeng/panel";

@Component({
  selector: 'app-properties-box-sizing',
  standalone: true,
  imports: [CommonModule, InputNumberModule, PropertyPanelRowComponent, ReactiveFormsModule, SliderModule, SliderComponent, FormsModule, AccordionModule, AppPropertyFilterPipe, MenuModule, PanelModule],
  template: `
    <p-panel header="Box sizing" [toggleable]="true" [collapsed]="false" toggler="header">
      <ng-container [formGroup]="formGroup">
        <app-property-item-slider label="padding"
                                  *ngIf="mustBeVisible || ('padding' | appPropertyFilter: searchText)"
                                  [control]="getFormControl('padding')"></app-property-item-slider>

        <app-property-item-slider label="height"
                                  *ngIf="mustBeVisible || ('height' | appPropertyFilter: searchText)"
                                  [max]="1000"
                                  [control]="getFormControl('height')"></app-property-item-slider>

        <app-property-item-slider label="width"
                                  [max]="1000"
                                  *ngIf="mustBeVisible || ('width' | appPropertyFilter: searchText)"
                                  [control]="getFormControl('width')"></app-property-item-slider>
      </ng-container>
    </p-panel>
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
export class BoxSizingComponent extends BasePropertyGroupComponent implements OnChanges{

  items: { label?: string; icon?: string; separator?: boolean }[] = [];

  constructor(public fb: FormBuilder,
              protected canvasStore: CanvasStore,
              private propertyFilter: AppPropertyFilterPipe) {
    super(fb, canvasStore, propertyFilter);
  }

  override ngOnChanges() {
    super.ngOnChanges();

    if (this.css?.boxSizing) {
      this.formGroup?.patchValue({
        ...this.css.boxSizing
      }, {emitEvent: false});
    }
  }


  protected override createFormGroup() {
    if (this.formGroupValueChangedSubscription) {
      this.formGroupValueChangedSubscription.unsubscribe();
    }

    const formGroup = this.baseFb.group({
      padding: new FormControl<Property.Padding | null | undefined>(null, {updateOn: 'blur'}),
      height: new FormControl<Property.Height | null | undefined>(null, {updateOn: 'blur'}),
      width: new FormControl<Property.Height | null | undefined>(null, {updateOn: 'blur'})
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
