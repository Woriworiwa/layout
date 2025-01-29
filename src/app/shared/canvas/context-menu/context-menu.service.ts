import {Injectable, OnDestroy} from "@angular/core";
import {ContextMenu} from "primeng/contextmenu";
import {Subject, Subscription, takeUntil} from "rxjs";

/* PrimeNg context menu is buggy and does not always close https://github.com/primefaces/primeng/issues/2456 */
@Injectable()
export class ContextMenuService implements OnDestroy {
  private destroy$ = new Subject<boolean>();
  previousContextMenu: ContextMenu | undefined = undefined;
  previousContextMenuShowSubscription: Subscription | undefined = undefined;

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  show(contextMenu: ContextMenu, event: any) {
    this.previousContextMenuShowSubscription = contextMenu.onShow
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
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
