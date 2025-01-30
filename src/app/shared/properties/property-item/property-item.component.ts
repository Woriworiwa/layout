import {Component, Input} from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormControl} from "@angular/forms";

@Component({
  imports: [CommonModule],
  template: `<p>base-property works!</p>`,
  styles: ``,
})
export class PropertyItemComponent {
  @Input() label = '';
  @Input() control: FormControl<any> = new FormControl<any>('');
}
