import {Injectable} from "@angular/core";
import {ContextMenu} from "primeng/contextmenu";
import {Subscription} from "rxjs";

/* PrimeNg context menu is buggy and does not always close https://github.com/primefaces/primeng/issues/2456 */
@Injectable()
export class ContextMenuService {
  previousContextMenu: ContextMenu | undefined = undefined;
  previousContextMenuShowSubscription: Subscription | undefined = undefined;

  constructor() {
  }

  show(event: any, contextMenu: ContextMenu) {
    this.previousContextMenuShowSubscription = contextMenu.onShow.subscribe(() => {
      this.previousContextMenu?.hide();
      this.previousContextMenuShowSubscription?.unsubscribe();
      this.previousContextMenu = contextMenu;
    });

    this.previousContextMenu?.hide();
    contextMenu.show(event);
  }

  hide() {
    this.previousContextMenuShowSubscription?.unsubscribe();
    this.previousContextMenu?.hide();
    this.previousContextMenu = undefined;
  }
}
