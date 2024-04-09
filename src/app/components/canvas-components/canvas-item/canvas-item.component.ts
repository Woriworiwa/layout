import {Component, EventEmitter, HostBinding, HostListener, Input, Output} from '@angular/core';
import { CommonModule } from '@angular/common';
import {ButtonModule} from "primeng/button";
import {InsertComponent} from "../../insert/insert.component";
import {OverlayPanelModule} from "primeng/overlaypanel";
import {SharedModule} from "primeng/api";
import {Frame} from "../../../models/frame.model";

@Component({
  selector: 'app-canvas-item',
  standalone: true,
  imports: [CommonModule, ButtonModule, InsertComponent, OverlayPanelModule, SharedModule],
  host: {
    '[class.selected]' : 'selectedFrameKey && selectedFrameKey === item?.key',
    '[class.hover]': 'isMouseOver',
    '[class.hover-add-item-enabled]': 'isMouseOver && !selectedFrameKey'
  },
  templateUrl: './canvas-item.component.html',
  styleUrl: './canvas-item.component.scss'
})
export class CanvasItemComponent {
  @Input() item: Frame | undefined;
  @Input() selectedFrameKey!: string | undefined;

  @Output() clicked = new EventEmitter<string>();

  @HostBinding('class.is-grabbing')
  isMouseOver = false;

  @HostListener('click', ['$event'])
  onClick($event:any) {
    $event.stopPropagation();
    this.clicked.emit(this.item?.key);
  }

  @HostListener('mouseover', ['$event'])
  onMouseOver($event:any) {
    $event.stopPropagation();
    $event.stopImmediatePropagation();
    this.isMouseOver = true;
    console.log('mouse over' + $event.target)
  }

  @HostListener('mouseout', ['$event'])
  onMouseLeave($event: any) {
    $event.stopPropagation();
    this.isMouseOver = false;
    console.log('mouse leave' + $event.target)
  }
}
