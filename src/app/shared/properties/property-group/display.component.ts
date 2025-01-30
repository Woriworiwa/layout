import {Component, OnChanges} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, FormControl, ReactiveFormsModule} from "@angular/forms";
import {Property} from "csstype";
import {takeUntil} from "rxjs";
import {InputNumberModule} from "primeng/inputnumber";
import {SliderModule} from "primeng/slider";
import {DropdownComponent} from "../property-item/dropdown.component";
import {AccordionModule} from "primeng/accordion";
import {PropertyGroupComponent} from "./property-group.component";
import {PanelModule} from "primeng/panel";
import {CanvasService} from "../../canvas/canvas.service";


import {Display, Height} from "../../../core/models/css/properties.enum";
import {FilterDirective} from "../filter.directive";

@Component({
  selector: 'app-properties-display',
  imports: [CommonModule, InputNumberModule, ReactiveFormsModule, SliderModule, DropdownComponent, AccordionModule, PanelModule, FilterDirective],
  template: `
    <p-panel header="Display" [toggleable]="true" [collapsed]="false" toggler="header">
      <app-property-item-dropdown
        *appFilter="Display; cssProperties: filterCssProperties; searchText: searchText; label: 'display'"
        [options]="displayOptions"
        [control]="getFormControl('display')"
        label="display"></app-property-item-dropdown>
    </p-panel>
  `,
  styles: `
    :host {
      display: contents;
    }
  `
})
export class DisplayComponent extends PropertyGroupComponent implements OnChanges {
  protected readonly Height = Height;
  protected readonly Display = Display;
  protected readonly displayOptions = [
    Display.block,
    Display.flex,
    Display.contents,
    Display.flow,
    Display.grid,
    Display.inline,
    Display.none
  ];

  constructor(fb: FormBuilder,
              canvasService: CanvasService) {
    super(fb, canvasService);
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

    const formGroup = this.formBuilder.group({
      display: new FormControl<Property.Display | null | undefined>(null)
    });

    this.formGroupValueChangedSubscription = formGroup.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((value: any) => {
        this.canvasService.updateCss({
          ...this.css,
          display: value
        });
      });

    return formGroup;
  }
}


