import {Component, EventEmitter, HostBinding, HostListener, Input, Output, ViewChild} from '@angular/core';
import { CommonModule } from '@angular/common';
import {ButtonModule} from "primeng/button";
import {InsertComponent} from "../../insert/insert.component";
import {OverlayPanelModule} from "primeng/overlaypanel";
import {SharedModule} from "primeng/api";
import {Frame} from "../../../models/frame.model";
import {ContextMenuComponent} from "../context-menu/context-menu.component";

@Component({
  selector: 'app-canvas-item',
  standalone: true,
  imports: [CommonModule, ButtonModule, InsertComponent, OverlayPanelModule, SharedModule, ContextMenuComponent],
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
  @ViewChild(ContextMenuComponent) contextMenu!: ContextMenuComponent;

  @HostBinding('class.is-grabbing')
  isMouseOver = false;

  @HostListener('click', ['$event'])
  onClick($event:any) {
    $event.stopPropagation();
    this.contextMenu.hide();
    this.clicked.emit(this.item?.key);
  }

  @HostListener('mouseover', ['$event'])
  onMouseOver($event:any) {
    $event.stopPropagation();
    $event.stopImmediatePropagation();
    this.isMouseOver = true;
  }

  @HostListener('mouseout', ['$event'])
  onMouseLeave($event: any) {
    $event.stopPropagation();
    this.isMouseOver = false;
  }

  @HostListener('contextmenu', ['$event'])
  onContextMenu($event: any) {
    $event.stopPropagation();
    this.contextMenu.show($event);
    return false;
    // this.contextMenu.target = $event;
  }
}
