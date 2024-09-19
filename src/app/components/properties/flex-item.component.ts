import {Component, OnChanges} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, FormControl, ReactiveFormsModule} from "@angular/forms";
import {takeUntil} from "rxjs";
import {CanvasStore} from "../../store/canvas.store";
import {DropdownComponent} from "./property-items/dropdown.component";
import {SelectButtonComponent} from "./property-items/select-button.component";
import {SliderComponent} from "./property-items/slider.component";
import {BasePropertyGroupComponent} from "./base-property-group.component";
import {AppPropertyFilterPipe} from "../../pipes/filter.pipe";
import {PanelModule} from "primeng/panel";

@Component({
  selector: 'app-properties-flex-item',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SelectButtonComponent, SliderComponent, DropdownComponent, AppPropertyFilterPipe, PanelModule],
  template: `
    <ng-container [formGroup]="formGroup">
      <p-panel [header]="title" [toggleable]="true" [collapsed]="false" toggler="header">
        <app-property-item-slider label="flex-grow"
                                  [control]="getFormControl('flexGrow')"
                                  *ngIf="mustBeVisible || ('flexGrow' | appPropertyFilter: searchText)"
                                  [suffix]="undefined"
                                  [max]="5"></app-property-item-slider>

        <app-property-item-slider label="flex-shrink"
                                  [control]="getFormControl('flexShrink')"
                                  *ngIf="mustBeVisible || ('flexShrink' | appPropertyFilter: searchText)"
                                  [suffix]="undefined"
                                  [max]="5"></app-property-item-slider>

        <app-property-item-slider label="flex-basis"
                                  [control]="getFormControl('flexBasis')"
                                  *ngIf="mustBeVisible || ('flexBasis' | appPropertyFilter: searchText)"
                                  [suffix]="undefined"
                                  [max]="5"></app-property-item-slider>
        <app-property-item-slider label="align-self"
                                  [control]="getFormControl('alignSelf')"
                                  *ngIf="mustBeVisible || ('alignSelf' | appPropertyFilter: searchText)"
                                  [suffix]="undefined"
                                  [max]="5"></app-property-item-slider>
      </p-panel>
    </ng-container>
  `,
  styles: `
    :host {
      display: contents;
    }
  `
})
export class PropertiesFlexItemComponent extends BasePropertyGroupComponent implements OnChanges {
  constructor(public fb: FormBuilder,
              protected frameStore: CanvasStore,
              private propertyFilter: AppPropertyFilterPipe) {
    super(fb, frameStore, propertyFilter);
  }

  override ngOnChanges() {
    super.ngOnChanges();

    if (this.css?.flexItem) {
      this.formGroup?.patchValue(this.css.flexItem, {emitEvent: false});
    }
  }

  protected override createFormGroup() {
    if (this.formGroupValueChangedSubscription) {
      this.formGroupValueChangedSubscription.unsubscribe();
    }

    const formGroup = this.baseFb.group({
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
        this.baseCanvasStore.updateCss({
          ...this.css,
          flexItem: value
        });
      });

    return formGroup;
  }
}
