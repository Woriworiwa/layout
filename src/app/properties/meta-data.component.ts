import {Component, Input, OnChanges, OnDestroy} from '@angular/core';
import { CommonModule } from '@angular/common';
import {Panel} from "primeng/panel";
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {CanvasService} from "../canvas/canvas.service";
import {Subject, Subscription, takeUntil} from "rxjs";
import {PropertyPanelRowComponent} from "./property-items/property-panel-row.component";
import {InputText} from "primeng/inputtext";

@Component({
  selector: 'app-properties-meta-data',
  imports: [CommonModule, Panel, ReactiveFormsModule, PropertyPanelRowComponent, InputText],
  template: `
    <p-panel header="Meta data" [toggleable]="true" [collapsed]="false" toggler="header">
      <ng-container [formGroup]="formGroup">
        <app-property-panel-row label="Label">
          <div>
            <input type="text" id="label" pInputText formControlName="label">
          </div>
        </app-property-panel-row>
      </ng-container>
    </p-panel>
  `,
  styles: ``,
})
export class MetaDataComponent implements OnChanges, OnDestroy {
  @Input() label: string | undefined;

  formGroup: FormGroup;
  formGroupValueChangedSubscription: Subscription | undefined;

  protected destroy$ = new Subject();

  constructor(private fb: FormBuilder,
              private canvasService: CanvasService) {
    this.formGroup = this.createFormGroup();
  }

  ngOnChanges() {
    this.formGroup?.patchValue({label: this.label}, {emitEvent: false});
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  protected createFormGroup() {
    if (this.formGroupValueChangedSubscription) {
      this.formGroupValueChangedSubscription.unsubscribe();
    }

    const formGroup = this.fb.group({
      label: new FormControl<string | null | undefined>(null, {updateOn: 'blur'}),
    });

    this.formGroupValueChangedSubscription = formGroup.valueChanges
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe((value: any) => {
        this.canvasService.renameItem(value.label);
      });

    return formGroup;
  }
}
