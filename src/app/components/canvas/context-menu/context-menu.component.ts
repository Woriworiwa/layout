import {Component, HostListener, Input, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ContextMenu, ContextMenuModule} from "primeng/contextmenu";
import {ContextMenuService} from "../../../services/context-menu.service";
import {MenuItem, MenuItemCommandEvent} from "primeng/api";
import {CanvasStore} from "../../../store/canvas.store";


@Component({
  selector: 'app-context-menu',
  standalone: true,
  imports: [CommonModule, ContextMenuModule],
  template: `
    <!--set triggerEvent to empty string. we manually handle showing the context menu from the canvas item-->
    <p-contextMenu [target]="target" [model]="items" triggerEvent="''" appendTo="body"></p-contextMenu>`,
  styles: ``
})
export class ContextMenuComponent {
  @Input() target: any;
  @Input() frameKey: string | undefined;
  @ViewChild(ContextMenu) contextMenu!: ContextMenu;

  items: MenuItem[] | undefined;

  constructor(private canvasStore: CanvasStore) {
  }

  ngOnInit() {
    this.items = [
      {
        label: 'Delete', icon: 'pi pi-fw pi-trash',
        command: () => {
          this.canvasStore.deleteCanvasItem(this.frameKey);
        }
      }
    ];
  }
}
