import { Component, input, model } from '@angular/core';
import { SelectButton } from 'primeng/selectbutton';
import { FormsModule } from '@angular/forms';

export interface TabOption {
  label: string;
  value: string;
  icon?: string;
}

@Component({
  selector: 'app-tab-switcher',
  imports: [SelectButton, FormsModule],
  templateUrl: './tab-switcher.component.html',
  styleUrl: './tab-switcher.component.scss',
})
export class TabSwitcherComponent {
  options = input.required<TabOption[]>();
  value = model.required<string>();
}
