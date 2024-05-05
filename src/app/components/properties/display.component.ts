import {Component, Input} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Css, Display} from "../../models/css.model";
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {CanvasStore} from "../../store/canvas.store";
import {Property} from "csstype";
import {Subject, Subscription, takeUntil} from "rxjs";
import {InputNumberModule} from "primeng/inputnumber";
import {PropertyPanelRowComponent} from "./property-items/property-panel-row.component";
import {SliderModule} from "primeng/slider";
import {DropdownComponent} from "./property-items/dropdown.component";
import {AccordionModule} from "primeng/accordion";
import {BasePropertyGroup} from "./base-property-group";
import {AppPropertyFilterPipe} from "../../pipes/filter.pipe";
import {PanelModule} from "primeng/panel";

@Component({
  selector: 'app-properties-display',
  standalone: true,
  imports: [CommonModule, InputNumberModule, PropertyPanelRowComponent, ReactiveFormsModule, SliderModule, DropdownComponent, AccordionModule, AppPropertyFilterPipe, PanelModule],
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
export class DisplayComponent extends BasePropertyGroup {
  displayOptions = [
    Display.block,
    Display.flex,
    Display.block,
    Display.contents,
    Display.flow,
    Display.grid,
    Display.inline,
    Display.none
  ];

  constructor(public fb: FormBuilder,
              protected canvasStore: CanvasStore,
              private propertyFilter: AppPropertyFilterPipe) {
    super(fb, canvasStore, propertyFilter);
  }

  override ngOnChanges() {
    super.ngOnChanges();

    if (this.css?.display) {
      this.formGroup?.patchValue(this.css.display, {emitEvent: false});
    }
  }


  protected override createFormGroup() {
    if (this.formGroupValueChangedSubscription) {
      this.formGroupValueChangedSubscription.unsubscribe();
    }

    const formGroup = this.baseFb.group({
      display: new FormControl<Property.Display | null | undefined>(null)
    });

    this.formGroupValueChangedSubscription = formGroup.valueChanges
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe((value: any) => {
        this.baseCanvasStore.updateCss({
          ...this.css,
          display: value
        });
      });

    return formGroup;
  }
}


