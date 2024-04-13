import {Component, EventEmitter, HostBinding, HostListener, Input, Output, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ButtonModule} from "primeng/button";
import {InsertComponent} from "../../insert/insert.component";
import {OverlayPanelModule} from "primeng/overlaypanel";
import {SharedModule} from "primeng/api";
import {CanvasItem} from "../../../models/canvas-item.model";
import {ContextMenuComponent} from "../context-menu/context-menu.component";
import {ContextMenuService} from "../../../services/context-menu.service";

@Component({
  selector: 'app-canvas-item',
  standalone: true,
  imports: [CommonModule, ButtonModule, InsertComponent, OverlayPanelModule, SharedModule, ContextMenuComponent],
  host: {
    '[class.selected]': 'selectedFrameKey && selectedFrameKey === item?.key',
    '[class.hover]': 'isMouseOver',
    '[class.hover-add-item-enabled]': 'isMouseOver && !selectedFrameKey'
  },
  templateUrl: './canvas-item.component.html',
  styleUrl: './canvas-item.component.scss'
})
export class CanvasItemComponent {
  @Input() item: CanvasItem | undefined;
  @Input() selectedFrameKey!: string | undefined;
  @Output() clicked = new EventEmitter<string>();
  @ViewChild(ContextMenuComponent) contextMenu!: ContextMenuComponent;
  @HostBinding('class.is-grabbing') isMouseOver = false;

  constructor(private contextMenuService: ContextMenuService) {
  }

  @HostListener('click', ['$event'])
  onClick($event: any) {
    $event.stopPropagation();
    this.contextMenuService.hide();
    this.clicked.emit(this.item?.key);
  }

  @HostListener('mouseover', ['$event'])
  onMouseOver($event: any) {
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
    $event.preventDefault();
    this.contextMenuService.show($event, this.contextMenu.contextMenu);
  }
}
