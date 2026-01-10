import { Component, input, OnChanges, OnDestroy, effect, inject, computed } from '@angular/core';
import { PropertyGroupContainerComponent } from './property-group-container.component';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, takeUntil } from 'rxjs';
import { PropertyRowComponent } from '../components/property-row.component';
import { BasePropertyGroupComponent } from './base-property-group.component';
import { CodeEditorComponent, codemirrorsHighlighter, tailwindAutocomplete, getAutocompleteTheme } from '@layout/shared';
import { ThemeService } from '../../core/theme/theme.service';

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
            [extensions]="editorExtensions()"
            [darkMode]="isDarkMode()"
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
  private themeService = inject(ThemeService);

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
