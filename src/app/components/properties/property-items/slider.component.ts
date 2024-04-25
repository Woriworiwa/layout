import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DropdownModule} from "primeng/dropdown";
import {PropertyPanelRowComponent} from "./property-panel-row.component";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {InputNumberModule} from "primeng/inputnumber";
import {SliderModule} from "primeng/slider";
import {POSTFIX_UNIT} from "../../../models/css.model";
import {InputGroupModule} from "primeng/inputgroup";
import {ButtonModule} from "primeng/button";
import {FloatLabelModule} from "primeng/floatlabel";
import {InputGroupAddonModule} from "primeng/inputgroupaddon";
import {InputTextModule} from "primeng/inputtext";

@Component({
  selector: 'app-property-item-slider',
  standalone: true,
  imports: [CommonModule, DropdownModule, PropertyPanelRowComponent, ReactiveFormsModule, InputNumberModule, SliderModule, InputGroupModule, ButtonModule, FloatLabelModule, InputGroupAddonModule, InputTextModule],
  template: `
    <app-property-panel-row [label]="label">
      <div>
        <p-inputGroup>
            <p-inputNumber [id]="label" inputId="integeronly" [formControl]="control" [suffix]="suffix"></p-inputNumber>
            <button type="button" pButton icon="pi pi-times" (click)="onClearButtonClick()" [disabled]="control.value == null" class="p-button-secondary"></button>
        </p-inputGroup>
        <p-slider [formControl]="control" [max]="max" ></p-slider>
      </div>
    </app-property-panel-row>
  `,
  styles: `
  :host {
    display: contents;

    //https://github.com/primefaces/primeng/issues/9949
    // temporary workaround for the issue
    ::ng-deep .p-inputgroup > p-inputnumber input.p-inputnumber-input {
      border-radius: 0;
      margin: 0;
    }

    ::ng-deep .p-inputgroup p-inputnumber:last-child input.p-inputnumber-input {
      border-top-right-radius: 3px;
      border-bottom-right-radius: 3px;
    }

    ::ng-deep .p-inputgroup p-inputnumber:first-child input.p-inputnumber-input {
      border-top-left-radius: 3px;
      border-bottom-left-radius: 3px;
    }
    // end temporary workaround
  }
  `
})
export class SliderComponent {
  @Input() label: string = '';
  @Input() control: FormControl<any> = new FormControl<any>('');
  @Input() max: number = 100;
  @Input() controlValue: unknown = null;
  @Input() suffix: string | undefined = POSTFIX_UNIT;

  constructor(private cd: ChangeDetectorRef) {
  }

  ngOnChanges() {
    this.control.valueChanges.subscribe((v: any) => {
      this.control.setValue(v, {emitEvent: false});
    })
  }

  onClearButtonClick() {
    this.control.setValue(null);
  }
}
