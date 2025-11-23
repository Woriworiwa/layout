import { Component, Input, OnInit, ViewChild, inject } from '@angular/core';

import {ContextMenu, ContextMenuModule} from "primeng/contextmenu";
import {MenuItem} from "primeng/api";
import {CopyPasteService} from "../copy-paste.service";
import {CanvasService} from "../canvas.service";


@Component({
    selector: 'app-context-menu',
    imports: [ContextMenuModule],
    template: `
    <!--set triggerEvent to empty string. we manually handle showing the context menu from the canvas item-->
    <p-contextMenu [target]="target" [model]="items" triggerEvent="''" appendTo="body"></p-contextMenu>`,
    styles: ``
})
export class ContextMenuComponent implements OnInit{
  private canvasService = inject(CanvasService);
  private copyPasteService = inject(CopyPasteService);

  @Input() target: any;
  @Input() frameKey: string | undefined;
  @ViewChild(ContextMenu) contextMenu!: ContextMenu;

  items: MenuItem[] | undefined;

  ngOnInit() {
    this.items = [
      {
        label: 'Delete', icon: 'pi pi-fw pi-trash',
        command: () => {
          this.canvasService.deleteItem(this.frameKey);
        }
      },
      {
        label: 'Copy', icon: 'pi pi-fw pi-copy',
        command: () => {
          this.copyPasteService.copy();
        }
      },
      {
        label: 'Paste', icon: 'pi pi-fw pi-file',
        command: () => {
          this.copyPasteService.paste();
        }
      }
    ];
  }
}
