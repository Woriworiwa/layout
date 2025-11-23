import {Component, Input} from '@angular/core';

import {AlignItems, FlexDirection, JustifyContent} from "../../core/models/css/properties.enum";
import {PropertiesFlexContainerComponent} from "../../shared/properties/property-group/flex-container.component";
import {CanvasItem} from "../../core/models/canvas-item.model";
import {Card} from "primeng/card";

@Component({
  selector: 'app-alignment',
  imports: [PropertiesFlexContainerComponent, Card],
  templateUrl: './alignment.component.html',
  styleUrl: './alignment.component.scss',
})
export class AlignmentComponent {
  protected readonly FlexDirection = FlexDirection;
  protected readonly JustifyContent = JustifyContent;
  protected readonly AlignItems = AlignItems;

  @Input() sourceItem: CanvasItem | undefined;
}
