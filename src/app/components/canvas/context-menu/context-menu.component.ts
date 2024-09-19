import {Component, Input, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ContextMenu, ContextMenuModule} from "primeng/contextmenu";
import {MenuItem} from "primeng/api";
import {CanvasStore} from "../../../store/canvas.store";
import {CopyPasteService} from "../../../services/copy-paste.service";


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

  constructor(private canvasStore: CanvasStore,
              private copyPasteService: CopyPasteService) {
  }

  ngOnInit() {
    this.items = [
      {
        label: 'Delete', icon: 'pi pi-fw pi-trash',
        command: () => {
          this.canvasStore.deleteCanvasItem(this.frameKey);
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
