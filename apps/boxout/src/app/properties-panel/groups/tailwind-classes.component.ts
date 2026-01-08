import { Component, input, OnChanges, OnDestroy, effect } from '@angular/core';
import { PropertyGroupContainerComponent } from './property-group-container.component';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, takeUntil } from 'rxjs';
import { PropertyRowComponent } from '../components/property-row.component';
import { InputText } from 'primeng/inputtext';
import { BasePropertyGroupComponent } from './base-property-group.component';

@Component({
  selector: 'app-properties-tailwind-classes',
  imports: [
    PropertyGroupContainerComponent,
    ReactiveFormsModule,
    PropertyRowComponent,
    InputText,
  ],
  template: `
    <app-property-group
      header="Tailwind Classes"
      [toggleable]="true"
      [collapsed]="collapsed()"
      groupId="tailwind-classes"
    >
      <ng-container [formGroup]="formGroup">
        <app-property-row label="Classes">
          <div>
            <input
              type="text"
              pInputText
              formControlName="tailwindClasses"
              placeholder="flex gap-4 p-4 bg-blue-100..."
              class="w-full"
            />
          </div>
        </app-property-row>
      </ng-container>
    </app-property-group>
  `,
  styles: `
    input {
      width: 100%;
    }
  `,
})
export class TailwindClassesComponent
  extends BasePropertyGroupComponent
  implements OnChanges, OnDestroy
{
  tailwindClasses = input<string | undefined>(undefined);

  constructor() {
    super();

    effect(() => {
      const classes = this.tailwindClasses();
      this.formGroup?.patchValue(
        { tailwindClasses: classes || '' },
        { emitEvent: false }
      );
    });
  }

  override ngOnChanges() {
    super.ngOnChanges();
  }

  override createFormGroup() {
    if (this.formGroupValueChangedSubscription) {
      this.formGroupValueChangedSubscription.unsubscribe();
    }

    const formGroup = this.formBuilder.group({
      tailwindClasses: new FormControl<string | null>(null),
    });

    this.formGroupValueChangedSubscription = formGroup.valueChanges
      .pipe(
        debounceTime(300),
        takeUntil(this.destroy$)
      )
      .subscribe((value) => {
        const classString = (value.tailwindClasses || '').trim();
        this.propertiesService.updateTailwindClasses(classString);
      });

    return formGroup;
  }
}
