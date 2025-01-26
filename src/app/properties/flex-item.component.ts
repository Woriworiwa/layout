import {Component, OnChanges} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, FormControl, ReactiveFormsModule} from "@angular/forms";
import {takeUntil} from "rxjs";
import {DropdownComponent} from "./property-items/dropdown.component";
import {SliderComponent} from "./property-items/slider.component";
import {BasePropertyGroupComponent} from "./base-property-group.component";
import {AppPropertyFilterPipe} from "./filter.pipe";
import {PanelModule} from "primeng/panel";
import {CanvasService} from "../canvas/canvas.service";
import {AlignSelf} from "../core/models/css.model";

@Component({
    selector: 'app-properties-flex-item',
    imports: [CommonModule, ReactiveFormsModule, SliderComponent, DropdownComponent, AppPropertyFilterPipe, PanelModule],
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
        <app-property-item-dropdown [options]="alignSelfOptions"
                                    [control]="getFormControl('alignSelf')"
                                    *ngIf="mustBeVisible || ('alignSelf' | appPropertyFilter: searchText)"
                                    label="align-self"></app-property-item-dropdown>
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
  /*justify content*/
  alignSelfOptions = [
    AlignSelf.start,
    AlignSelf.end,
    AlignSelf.center,
    AlignSelf.baseline,
    AlignSelf.stretch
  ]

  constructor(public fb: FormBuilder,
              protected canvasService: CanvasService,
              private propertyFilter: AppPropertyFilterPipe) {
    super(fb, canvasService, propertyFilter);
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
      flexGrow: new FormControl<number | null | undefined>(null, {updateOn: 'blur'}),
      flexShrink: new FormControl<number | null | undefined>(null, {updateOn: 'blur'}),
      flexBasis: new FormControl<number | null | undefined>(null, {updateOn: 'blur'}),
      alignSelf: new FormControl<number | null | undefined>(null, {updateOn: 'blur'}),
    });

    this.formGroupValueChangedSubscription = formGroup.valueChanges
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe((value: any) => {
        this.baseCanvasService.updateCss({
          ...this.css,
          flexItem: value
        });
      });

    return formGroup;
  }
}
