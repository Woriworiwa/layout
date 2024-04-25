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

@Component({
  selector: 'app-properties-display',
  standalone: true,
  imports: [CommonModule, InputNumberModule, PropertyPanelRowComponent, ReactiveFormsModule, SliderModule, DropdownComponent],
  template: `
    <div class="title">Display</div>
    <app-property-item-dropdown [options]="displayOptions"
                                [control]="getFormControl('display')"
                                label="display"></app-property-item-dropdown>
  `,
  styles: `
    :host {
      display: contents;
    }
  `
})
export class DisplayComponent {
  @Input() css: Css | undefined;

  formGroup: FormGroup;
  formGroupValueChangedSubscription: Subscription | undefined;

  private destroy$ = new Subject();

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
              protected canvasStore: CanvasStore) {
    this.formGroup = this.createFormGroup();
  }

  ngOnChanges() {
    this.formGroup = this.createFormGroup();

    if (this.css?.display) {
      this.formGroup?.patchValue(this.css.display, {emitEvent: false});
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
      display: new FormControl<Property.Display | null | undefined>(null)
    });

    this.formGroupValueChangedSubscription = formGroup.valueChanges
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe((value: any) => {
        this.canvasStore.updateCss({
          ...this.css,
          display: value
        });
      });

    return formGroup;
  }

  getFormControl(name: string) {
    return this.formGroup.get(name) as FormControl;
  }
}


