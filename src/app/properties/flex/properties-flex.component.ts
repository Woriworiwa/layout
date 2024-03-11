import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FlexDirection} from "../../services/frame.model";
import {NbButtonGroupModule} from "@nebular/theme";
import {FormBuilder, ReactiveFormsModule} from "@angular/forms";
import {FrameService} from "../../services/frame.service";
import {SelectButtonModule} from "primeng/selectbutton";
import {Subject, takeUntil} from "rxjs";
import {PropertyPanelRowComponent} from "../property-panel-row.component";

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
    flexWrap: [false]
  });

  constructor(public fb: FormBuilder,
              protected frameService: FrameService) {
  }

  ngOnInit() {
    this.formGroup.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((value: any) => {
        this.frameService.updateFlexLayoutSettings(value);
      });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
