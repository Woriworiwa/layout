import { Component, input, OnChanges, OnDestroy, effect, inject, computed } from '@angular/core';

import { PropertyGroupComponent } from '../components/property-group.component';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, takeUntil } from 'rxjs';
import { PropertyRowComponent } from '../components/property-row.component';
import { InputText } from 'primeng/inputtext';
import { BasePropertyGroupComponent } from '../components/base-property-group.component';
import { CodeEditorComponent, codemirrorsHighlighter, tailwindAutocomplete, getAutocompleteTheme } from '@layout/shared';
import { ThemeService } from '../../core/theme/theme.service';

@Component({
  selector: 'app-properties-meta-data',
  imports: [
    PropertyGroupComponent,
    ReactiveFormsModule,
    PropertyRowComponent,
    InputText,
    CodeEditorComponent,
  ],
  template: `
    <app-property-group
      header="Meta data"
      [toggleable]="true"
      [collapsed]="collapsed()"
      groupId="meta-data"
    >
      <ng-container [formGroup]="formGroup">
        <app-property-row label="Label" [control]="getFormControl('label')">
          <div>
            <input type="text" id="label" pInputText formControlName="label" />
          </div>
        </app-property-row>

        <app-property-row label="Tailwind Classes" [control]="getFormControl('tailwindClasses')">
          <shared-code-editor
            formControlName="tailwindClasses"
            [placeholder]="'flex gap-4 p-4 bg-blue-100...'"
            [multiline]="false"
            [extensions]="editorExtensions()"
            [darkMode]="isDarkMode()"
          />
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
export class MetaDataComponent
  extends BasePropertyGroupComponent
  implements OnChanges, OnDestroy
{
  private themeService = inject(ThemeService);

  label = input<string | undefined>(undefined);
  tailwindClasses = input<string | undefined>(undefined);

  // Get dark mode from theme service
  isDarkMode = computed(() => this.themeService.config().darkMode);

  // CodeMirror extensions for Tailwind syntax highlighting and autocomplete
  editorExtensions = computed(() => [
    codemirrorsHighlighter(),
    tailwindAutocomplete(),
    getAutocompleteTheme(this.isDarkMode())
  ]);

  constructor() {
    super();
    effect(() => {
      const classes = this.tailwindClasses();
      this.formGroup?.patchValue(
        {
          label: this.label(),
          tailwindClasses: classes || null
        },
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
      label: new FormControl<string | null | undefined>(null, {
        updateOn: 'blur',
      }),
      tailwindClasses: new FormControl<string | null>(null),
    });

    // Subscribe to label changes (no debounce, updates on blur)
    formGroup.get('label')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        this.propertiesService.renameSelectedItem(value || '');
      });

    // Subscribe to tailwindClasses changes with debounce
    formGroup.get('tailwindClasses')?.valueChanges
      .pipe(
        debounceTime(300),
        takeUntil(this.destroy$)
      )
      .subscribe((value) => {
        const classString = (value || '').trim();
        this.propertiesService.updateTailwindClasses(classString);
      });

    return formGroup;
  }
}
