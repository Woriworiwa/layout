import {Component, Input} from '@angular/core';
import { CommonModule } from '@angular/common';
import {TutorialSubjectComponent} from "./tutorial-subject.component";
import {AlignItems, FlexDirection, JustifyContent} from "../../core/models/css/properties.enum";
import {PropertiesFlexContainerComponent} from "../../shared/properties/property-group/flex-container.component";
import {CanvasItem} from "../../core/models/canvas-item.model";

@Component({
  selector: 'app-alignment',
  imports: [CommonModule, PropertiesFlexContainerComponent],
  templateUrl: './alignment.component.html',
  styleUrl: './alignment.component.scss',
})
export class AlignmentComponent extends TutorialSubjectComponent{
  protected readonly FlexDirection = FlexDirection;
  protected readonly JustifyContent = JustifyContent;
  protected readonly AlignItems = AlignItems;

  @Input() sourceItem: CanvasItem | undefined;
}
