import { Component, inject } from '@angular/core';

import {CssPrismComponent} from "../../renderer/prisms/css-prism.component";
import {SelectionService} from "../../canvas/selection/selection.service";
import {CanvasItem} from "../../core/models/canvas-item.model";
import {CanvasService} from "../../canvas/canvas.service";
import {SelectButton} from "primeng/selectbutton";
import {FormsModule} from "@angular/forms";
import {filter} from "rxjs";

/**
 * The `InspectorComponent` is responsible for displaying the CSS properties of the selected or hovered item.
 * It has a mode that can be either 'select' or 'hover', which determines when to serialize the CSS properties.
 */
@Component({
  selector: 'app-inspector',
  imports: [CssPrismComponent, SelectButton, FormsModule],
  template: `
    <div class="inspection-mode">
      <p-selectButton
        [options]="modes"
        [(ngModel)]="mode"
        optionLabel="name"
        allowEmpty="false"
        optionValue="value"/>
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
  protected selectionService = inject(SelectionService);
  protected canvasService = inject(CanvasService);

  canvasItem: CanvasItem | undefined;

  mode: 'select' | 'hover' = 'select'

  modes: any[] = [
    { name: 'Select', value: 'select' },
    { name: 'Hover', value: 'hover' }
  ];

  constructor() {
    this.initializeInspection();
  }

  private initializeInspection = () => {
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
