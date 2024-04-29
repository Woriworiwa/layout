import {ComponentRef, Injectable} from "@angular/core";
import {ContextMenu} from "primeng/contextmenu";
import {Subscription} from "rxjs";
import {CanvasSelectionItemComponent} from "../components/canvas/selection/canvas-selection-item.component";

/* PrimeNg context menu is buggy and does not always close https://github.com/primefaces/primeng/issues/2456 */
@Injectable()
export class ContextMenuService {
  previousContextMenu: ContextMenu | undefined = undefined;
  previousContextMenuShowSubscription: Subscription | undefined = undefined;

  show(contextMenu: ContextMenu, event: any) {
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
