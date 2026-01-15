import { Component, computed, input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Textarea } from 'primeng/textarea';
import { InputGroup } from 'primeng/inputgroup';
import { Button, ButtonDirective, ButtonIcon } from 'primeng/button';
import { Menu } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { BaseFormItemComponent } from './base-form-item.component';
import { PropertiesControlKeyboardDirective } from '../properties-control-keyboard.directive';

@Component({
  selector: 'app-text-area-field',
  imports: [
    ReactiveFormsModule,
    Textarea,
    InputGroup,
    ButtonDirective,
    ButtonIcon,
    Menu,
    Button,
    PropertiesControlKeyboardDirective,
  ],
  template: `
    <p-inputgroup [dt]="inputGroup">
      <textarea
        pTextarea
        appPropertiesControlKeyboard
        [formControl]="control()!"
        [placeholder]="placeholder()"
        [rows]="rows()"
      ></textarea>
      @if (presets() && presets().length > 0) {
        <p-button
          type="button"
          icon="pi pi-ellipsis-v"
          [dt]="button"
          (click)="menu.toggle($event)"
        ></p-button>
        <p-menu #menu [model]="menuItems()" [popup]="true" appendTo="body" />
      }
      <button
        type="button"
        pButton
        [dt]="button"
        (click)="onClearButtonClick()"
        [disabled]="control().value === null || control().value === undefined"
      >
        <i class="pi pi-times" pButtonIcon></i>
      </button>
    </p-inputgroup>
  `,
  styles: `
    :host {
      display: contents;
    }

    textarea {
      font-family: 'Courier New', Courier, monospace;
      resize: vertical;
    }
  `,
})
export class TextAreaFieldComponent extends BaseFormItemComponent {
  placeholder = input<string>('');
  presets = input<{ label: string; value: string }[]>([]);
  rows = input<number>(4);

  menuItems = computed<MenuItem[]>(() => {
    return this.presets().map((preset) => ({
      label: preset.label,
      command: () => {
        this.control()?.setValue(preset.value);
        this.control()?.markAsDirty();
      },
    }));
  });

  onClearButtonClick() {
    this.control()?.setValue(null);
  }

  inputGroup = {
    addon: {
      borderRadius: '0',
    },
  };

  button = {
    root: {
      paddingX: '0',
      paddingY: '0',
    },
    primary: {
      background: '{form.field.background}',
      borderColor: 'transparent',
      hoverBackground: 'transparent',
      hoverColor: '{form.field.hoverColor}',
      hoverBorderColor: 'transparent',
    },
    light: {
      primary: {
        color: '{surface.400}',
        hoverBackground: 'transparent',
      },
    },
    dark: {
      primary: {
        color: '{surface.400}',
        hoverBackground: 'transparent',
      },
    },
  };
}
