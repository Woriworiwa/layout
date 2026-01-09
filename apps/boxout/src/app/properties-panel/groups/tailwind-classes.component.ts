import { Component, input, OnChanges, OnDestroy, effect } from '@angular/core';
import { PropertyGroupContainerComponent } from './property-group-container.component';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, takeUntil } from 'rxjs';
import { PropertyRowComponent } from '../components/property-row.component';
import { BasePropertyGroupComponent } from './base-property-group.component';
import { CodeEditorComponent, tailwindHighlighting } from '@layout/shared';

@Component({
  selector: 'app-properties-tailwind-classes',
  imports: [
    PropertyGroupContainerComponent,
    ReactiveFormsModule,
    PropertyRowComponent,
    CodeEditorComponent,
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
          <shared-code-editor
            formControlName="tailwindClasses"
            [placeholder]="'flex gap-4 p-4 bg-blue-100...'"
            [multiline]="false"
            [extensions]="editorExtensions"
          />
        </app-property-row>
      </ng-container>
    </app-property-group>
  `,
  styles: ``,
})
export class TailwindClassesComponent
  extends BasePropertyGroupComponent
  implements OnChanges, OnDestroy
{
  tailwindClasses = input<string | undefined>(undefined);

  // CodeMirror extensions for Tailwind syntax highlighting
  editorExtensions = [tailwindHighlighting()];

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
