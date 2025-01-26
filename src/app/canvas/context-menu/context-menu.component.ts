import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ContextMenu, ContextMenuModule} from "primeng/contextmenu";
import {MenuItem} from "primeng/api";
import {CopyPasteService} from "../copy-paste.service";
import {CanvasService} from "../canvas.service";


@Component({
    selector: 'app-context-menu',
    imports: [CommonModule, ContextMenuModule],
    template: `
    <!--set triggerEvent to empty string. we manually handle showing the context menu from the canvas item-->
    <p-contextMenu [target]="target" [model]="items" triggerEvent="''" appendTo="body"></p-contextMenu>`,
    styles: ``
})
export class ContextMenuComponent implements OnInit{
  @Input() target: any;
  @Input() frameKey: string | undefined;
  @ViewChild(ContextMenu) contextMenu!: ContextMenu;

  items: MenuItem[] | undefined;

  constructor(private canvasService: CanvasService,
              private copyPasteService: CopyPasteService) {
  }

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
