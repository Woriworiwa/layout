import { Component, ElementRef, OnChanges, inject } from '@angular/core';

import { CanvasItemBaseComponent } from '../canvas-item-base.component';
import { KeyboardCommandsDirective } from '../../keyboard/keyboard-commands.directive';
import { AssetDropDirective } from '../../drag-drop/asset-drop.directive';
import { EditableContentDirective } from './editable-content.directive';

@Component({
  selector: 'app-text',
  imports: [],
  template: ``,
  hostDirectives: [
    KeyboardCommandsDirective,
    {
      directive: EditableContentDirective,
      outputs: ['contentChanged'],
    },
    {
      directive: AssetDropDirective,
      inputs: ['appAssetDrop'],
    },
  ],
  styles: `
    :host {
      font-family: sans-serif;
      font-weight: lighter;
      display: block;
      padding: 5px;
      background: var(--yellow-50);
      border: 1px solid var(--border-primary);
      white-space: pre-wrap;

      &[contenteditable='true']:focus {
        outline: none;
        background-color: transparent;
        box-shadow: none;
        border: 1px dashed black;
      }
    }
  `,
})
export class TextComponent
  extends CanvasItemBaseComponent
  implements OnChanges
{
  private elementRef = inject(ElementRef);

  override ngOnChanges() {
    this.elementRef.nativeElement.innerText = this.item().content;

    super.ngOnChanges();
  }
}
