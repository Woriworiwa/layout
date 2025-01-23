import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {CssPrismComponent} from "../prisms/css-prism.component";
import {SelectionService} from "../../services/selection.service";
import {CanvasItem} from "../../models/canvas-item.model";
import {CanvasService} from "../../services/canvas.service";
import {SelectButton} from "primeng/selectbutton";
import {FormsModule} from "@angular/forms";
import {filter} from "rxjs";

@Component({
  selector: 'app-inspector',
  imports: [CommonModule, CssPrismComponent, SelectButton, FormsModule],
  template: `
    <div class="insert-position">
      <p-selectButton
        [options]="modes"
        [(ngModel)]="mode"
        optionLabel="name"
        allowEmpty="false"
        optionValue="value" />
    </div>
    <app-css-prism [canvasItems]="canvasItem ? [canvasItem] : this.canvasService.items"></app-css-prism>`,
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
  `,
})
export class InspectorComponent {
  canvasItem: CanvasItem | undefined;

  mode: 'select' | 'hover' = 'select'

  modes: any[] = [
    { name: 'Select', value: 'select' },
    { name: 'Hover', value: 'hover' }
  ];

  constructor(protected selectionService: SelectionService,
              protected canvasService: CanvasService) {
    this.selectionService.hoverItem$
      .pipe(filter(_ => this.mode === 'hover'))
      .subscribe(item => {
        this.canvasItem = item;
      });

    this.selectionService.selectedItem$
      .pipe(filter(_ => this.mode === 'select'))
      .subscribe(item => {
        this.canvasItem = item;
      });
  }
}
