import {Injectable} from "@angular/core";
import {ContextMenu} from "primeng/contextmenu";

/* PrimeNg context menu is buggy and does not always close https://github.com/primefaces/primeng/issues/2456 */
@Injectable()
export class ContextMenuService {
  contextMenu: ContextMenu | undefined = undefined;

  constructor() {
  }

  add(contextMenu: ContextMenu) {
    this.contextMenu?.hide();
    this.contextMenu = contextMenu;
  }

  remove(contextMenu: ContextMenu) {
    this.contextMenu?.hide();
  }
}
