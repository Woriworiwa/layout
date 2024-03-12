import {Component, Input} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FlexDirection, FlexLayoutSettings, FlexWrap} from "../../core/models/frame.model";
import {NbButtonGroupModule} from "@nebular/theme";
import {FormBuilder, ReactiveFormsModule} from "@angular/forms";
import {SelectButtonModule} from "primeng/selectbutton";
import {Subject, takeUntil} from "rxjs";
import {PropertyPanelRowComponent} from "../property-panel-row.component";
import {CanvasStore} from "../../core/stores/canvas.store";

@Component({
  selector: 'app-properties-flex',
  standalone: true,
  imports: [CommonModule, NbButtonGroupModule, ReactiveFormsModule, SelectButtonModule, PropertyPanelRowComponent],
  template: `
    <ng-container [formGroup]="formGroup">
      <app-property-panel-row label="Direction">
        <p-selectButton [options]="flexDirectionOptions"
                        formControlName="flexDirection"
                        optionLabel="label"
                        optionValue="value"></p-selectButton>
      </app-property-panel-row>

      <app-property-panel-row label="Wrap">
        <p-selectButton [options]="flexWrapOptions"
                        formControlName="flexWrap"
                        optionLabel="label"
                        optionValue="value"></p-selectButton>
      </app-property-panel-row>
    </ng-container>
  `,
  styles: `
    :host {
      display: contents;
    }
  `
})
export class PropertiesFlexComponent {
  @Input() flexLayoutSettings: FlexLayoutSettings | undefined;

  private destroy$ = new Subject();

  flexDirectionOptions = [
    {label: 'Row', value: FlexDirection.ROW},
    {label: 'Column', value: FlexDirection.COLUMN}
  ]

  flexWrapOptions = [
    {label: 'Yes', value: true},
    {label: 'No', value: false}
  ]

  formGroup = this.fb.group({
    flexDirection: [FlexDirection.ROW],
    flexWrap: [FlexWrap.NOWRAP]
  });

  constructor(public fb: FormBuilder,
              protected frameStore: CanvasStore) {
  }

  ngOnInit() {
    this.formGroup.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((value: any) => {
        this.frameStore.updateFlexLayoutSettings(value);
      });
  }

  ngOnChanges() {
    if (this.flexLayoutSettings) {
      this.formGroup.patchValue(this.flexLayoutSettings, {emitEvent: false});
    }
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
