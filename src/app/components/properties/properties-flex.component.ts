import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {SelectButtonModule} from "primeng/selectbutton";
import {Subject, Subscription, takeUntil, takeWhile} from "rxjs";
import {PropertyPanelRowComponent} from "./property-panel-row.component";
import {CanvasStore} from "../../store/canvas.store";
import {SliderModule} from "primeng/slider";
import {InputNumberModule} from "primeng/inputnumber";
import {Property} from "csstype";
import {DropdownModule} from "primeng/dropdown";
import {AlignItems, FlexDirection, FlexLayoutSettings, FlexWrap, JustifyContent} from "../../models/flex-layout.model";
import {DropdownComponent} from "./templates/dropdown.component";
import {InputGroupModule} from "primeng/inputgroup";
import {InputGroupAddonModule} from "primeng/inputgroupaddon";
import {InputTextModule} from "primeng/inputtext";

@Component({
  selector: 'app-settings-flex',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ReactiveFormsModule, SelectButtonModule, PropertyPanelRowComponent, FormsModule, SliderModule, InputNumberModule, DropdownModule, DropdownComponent, InputGroupModule, InputGroupAddonModule, InputTextModule],
  templateUrl: './properties-flex.component.html',
  styles: `
    :host {
      display: contents;
    }

    .trbl {
      display: flex;
      input {
        flex-grow: 1;
      }
    }
  `
})
export class PropertiesFlex {
  @Input() flexLayoutSettings: FlexLayoutSettings | undefined;

  /* options */
  /*direction*/
  flexDirectionOptions = [
    {label: 'Row', value: FlexDirection.row},
    {label: 'Column', value: FlexDirection.column}
  ]

  /*wrap*/
  flexWrapOptions = [
    {label: 'Yes', value: FlexWrap.wrap},
    {label: 'No', value: FlexWrap.nowrap}
  ]

  justifyContentOptions = [
    JustifyContent.center,
    JustifyContent.start,
    JustifyContent.end,
    JustifyContent["space-around"],
    JustifyContent["space-between"],
    JustifyContent["space-evenly"]
  ]

  alignItemsOptions = [
    AlignItems.start,
    AlignItems.end,
    AlignItems.center,
    AlignItems.stretch,
    AlignItems.baseline
  ]

  formGroup: FormGroup;
  formGroupValueChangedSubscription: Subscription | undefined;

  private destroy$ = new Subject();
  private formUpdating = false;

  get justifyContent(): FormControl {
    return this.formGroup?.get('justifyContent') as FormControl;
  }
  get alignItems(): FormControl {
    return this.formGroup?.get('alignItems') as FormControl;
  }

  constructor(public fb: FormBuilder,
              protected frameStore: CanvasStore) {
    this.formGroup = this.createFormGroup();
  }

  ngOnChanges() {
    this.formGroup = this.createFormGroup();

    if (this.flexLayoutSettings) {
      this.formGroup?.patchValue({
        ...this.flexLayoutSettings,
        gap: this.flexLayoutSettings.gap?.toString()
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
      flexDirection: new FormControl<Property.FlexDirection | null | undefined>(undefined),
      flexWrap: [''],
      gap: new FormControl<Property.Gap | null | undefined>(null),
      justifyContent: new FormControl<Property.JustifyContent | null | undefined>(null),
      alignItems: new FormControl<Property.AlignItems | null | undefined>(null),
      padding: new FormControl<Property.Padding | null  | undefined>(null)
    });

    this.formGroupValueChangedSubscription = formGroup.valueChanges
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe((value: any) => {
        this.frameStore.updateFlexLayoutSettings(value);
      });

    return formGroup;
  }
}
