import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {EditorContentDirective} from "../../../directives/editorcontent.directive";

@Component({
  selector: 'app-text',
  standalone: true,
  imports: [CommonModule],
  template: `<p><ng-content></ng-content></p>`,

  styles: `
  :host{
    display: block;
    padding: 5px;
    background-color: #ed9534;
    border-radius: 6px;
    border: 2px solid black;
    box-shadow: inset 3px 3px 7px 5px #f2ad62;
  }
  `
})
export class TextComponent {}
