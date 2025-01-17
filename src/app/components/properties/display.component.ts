import {Component, OnChanges} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Display} from "../../models/css.model";
import {FormBuilder, FormControl, ReactiveFormsModule} from "@angular/forms";
import {Property} from "csstype";
import {takeUntil} from "rxjs";
import {InputNumberModule} from "primeng/inputnumber";
import {SliderModule} from "primeng/slider";
import {DropdownComponent} from "./property-items/dropdown.component";
import {AccordionModule} from "primeng/accordion";
import {BasePropertyGroupComponent} from "./base-property-group.component";
import {AppPropertyFilterPipe} from "../../pipes/filter.pipe";
import {PanelModule} from "primeng/panel";
import {CanvasService} from "../../services/canvas.service";

@Component({
    selector: 'app-properties-display',
    imports: [CommonModule, InputNumberModule, ReactiveFormsModule, SliderModule, DropdownComponent, AccordionModule, AppPropertyFilterPipe, PanelModule],
    template: `
    <p-panel header="Display" [toggleable]="true" [collapsed]="false" toggler="header">
      <app-property-item-dropdown [options]="displayOptions"
                                  [control]="getFormControl('display')"
                                  *ngIf="mustBeVisible || ('display' | appPropertyFilter: searchText)"
                                  label="display"></app-property-item-dropdown>
    </p-panel>
  `,
    styles: `
    :host {
      display: contents;
    }
  `
})
export class DisplayComponent extends BasePropertyGroupComponent implements OnChanges {
  displayOptions = [
    Display.block,
    Display.flex,
    Display.contents,
    Display.flow,
    Display.grid,
    Display.inline,
    Display.none
  ];

  constructor(public fb: FormBuilder,
              protected canvasService: CanvasService,
              private propertyFilter: AppPropertyFilterPipe) {
    super(fb, canvasService, propertyFilter);
  }

  override ngOnChanges() {
    super.ngOnChanges();

    if (this.css?.display) {
      this.formGroup?.patchValue(this.css.display, {emitEvent: false});
    }
  }


  override createFormGroup() {
    if (this.formGroupValueChangedSubscription) {
      this.formGroupValueChangedSubscription.unsubscribe();
    }

    const formGroup = this.baseFb.group({
      display: new FormControl<Property.Display | null | undefined>(null)
    });

    this.formGroupValueChangedSubscription = formGroup.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((value: any) => {
        this.baseCanvasService.updateCss({
          ...this.css,
          display: value
        });
      });

    return formGroup;
  }
}


