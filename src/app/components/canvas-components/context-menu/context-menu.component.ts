import {Component, Input, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ContextMenu, ContextMenuModule} from "primeng/contextmenu";
import {ContextMenuService} from "../../../services/context-menu.service";
import {MenuItem} from "primeng/api";
import {CanvasStore} from "../../../store/canvas.store";


@Component({
  selector: 'app-context-menu',
  standalone: true,
  imports: [CommonModule, ContextMenuModule],
  template: `
    <p-contextMenu [target]="target" [model]="items" [global]="true" (onShow)="onShow()"
                   (onHide)="onHide()"></p-contextMenu>`,
  styles: ``
})
export class ContextMenuComponent {
  @Input() target: any;
  @Input() frameKey: string | undefined;

  @ViewChild(ContextMenu) contextMenu!: ContextMenu;

  items: MenuItem[] | undefined;

  constructor(private contextMenuService: ContextMenuService,
              private canvasStore: CanvasStore) {
  }

  ngOnInit() {
    this.items = [
      {
        label: 'Delete', icon: 'pi pi-fw pi-trash',
        command: () => {
          this.canvasStore.deleteFrame(this.frameKey);
        }
      }
    ];
  }

  hide() {
    setTimeout(() => {
      this.contextMenu.hide();
    }, 1);
  }

  show(event: any) {
    this.contextMenu.show(event)
  }

  onShow() {
    this.contextMenuService.add(this.contextMenu);
  }

  onHide() {
    this.contextMenuService.remove(this.contextMenu);
  }
}
