import {
  ComponentRef,
  ElementRef,
  Injectable,
  OnDestroy,
  ViewContainerRef,
  inject,
} from '@angular/core';
import { CanvasStore } from '../store/canvas.store';
import { CanvasItem } from '@layout/models';
import { SelectionItemComponent } from './selection-item.component';
import { CanvasHoverItemComponent } from './canvas-hover-item.component';
import { ContextMenuService } from '../context-menu/context-menu.service';
import { AssetDragDropService } from '../drag-drop/asset-drag-drop.service';
import {
  BehaviorSubject,
  combineLatestWith,
  distinctUntilChanged,
  fromEvent,
  map,
  merge,
  Observable,
  Subject,
  takeUntil,
} from 'rxjs';

@Injectable()
export class SelectionService implements OnDestroy {
  private canvasStore = inject(CanvasStore);
  private contextMenuService = inject(ContextMenuService);
  private assetDragDropService = inject(AssetDragDropService);

  overlay!: ViewContainerRef;
  canvas!: ElementRef;
  allowAdd = true;

  canvasSelectionItem: ComponentRef<SelectionItemComponent> | undefined =
    undefined;
  canvasHoverItem: ComponentRef<CanvasHoverItemComponent> | undefined =
    undefined;

  private selectedItemId: BehaviorSubject<string | undefined> =
    new BehaviorSubject<string | undefined>(undefined);
  private selectedItemId$: Observable<string | undefined>;
  private destroy$ = new Subject<boolean>();

  protected hoverCanvasItemIdSubject: BehaviorSubject<string | undefined> =
    new BehaviorSubject<string | undefined>(undefined);

  constructor() {
    this.selectedItemId$ = this.selectedItemId.asObservable();
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  setSelectedItemKey(key: string | undefined) {
    this.selectedItemId.next(key);
  }

  setHoverItemKey(key: string | undefined) {
    this.hoverCanvasItemIdSubject.next(key);
  }

  get selectedItem() {
    return this.canvasStore.getItemById(
      undefined,
      this.selectedItemId.getValue(),
    );
  }

  get selectedItem$() {
    return this.selectedItemId$.pipe(
      map((selectedItemId) =>
        this.canvasStore.getItemById(undefined, selectedItemId),
      ),
    );
  }

  get hoverItem$() {
    return this.hoverCanvasItemIdSubject.pipe(
      map((hoverItemId) =>
        this.canvasStore.getItemById(undefined, hoverItemId),
      ),
    );
  }

  initialize(overlay: ViewContainerRef, canvas: ElementRef, allowAdd: boolean) {
    this.overlay = overlay;
    this.canvas = canvas;
    this.allowAdd = allowAdd;

    merge(
      this.selectedItem$,
      fromEvent(window, 'resize').pipe(map(() => this.selectedItem)),
    )
      .pipe(takeUntil(this.destroy$))
      .subscribe((selectedFrame) => {
        if (!selectedFrame && this.canvasSelectionItem) {
          this.removeItem(this.canvasSelectionItem);
          this.canvasSelectionItem = undefined;
        } else {
          if (selectedFrame) {
            this.renderItem('selection', selectedFrame);
          }
        }
      });

    this.hoverCanvasItemIdSubject
      .pipe(
        distinctUntilChanged(),
        takeUntil(this.destroy$),
        map((hoverItemKey) =>
          this.canvasStore.getItemById(undefined, hoverItemKey),
        ),
      )
      .pipe(combineLatestWith(this.assetDragDropService.isDragging$))
      .subscribe(([hoverFrame, isDragging]) => {
        if (!hoverFrame && this.canvasHoverItem) {
          this.removeItem(this.canvasHoverItem);
          this.canvasHoverItem = undefined;
        } else {
          if (isDragging || !hoverFrame || !hoverFrame.key) {
            if (this.canvasHoverItem) {
              this.removeItem(this.canvasHoverItem);
              this.canvasHoverItem = undefined;
            }

            return;
          }

          if (this.selectedItem?.key === hoverFrame.key) {
            return;
          }

          this.renderItem('hover', hoverFrame);
        }
      });
  }

  showContextMenu(event: MouseEvent) {
    setTimeout(() => {
      if (this.canvasSelectionItem) {
        this.contextMenuService.show(
          this.canvasSelectionItem.instance.contextMenu.contextMenu,
          event,
        );
      }
    }, 10);
  }

  renderItem(itemType: 'selection' | 'hover', canvasItem: CanvasItem) {
    const element: HTMLElement = this.getTargetElement(canvasItem);
    if (!element) {
      return;
    }

    if (itemType === 'selection') {
      if (this.canvasSelectionItem) {
        this.removeItem(this.canvasSelectionItem);
      }
      this.canvasSelectionItem = this.overlay.createComponent(
        SelectionItemComponent,
      );
      this.addItem(this.canvasSelectionItem.instance, canvasItem, element);
    } else if (itemType === 'hover') {
      if (this.canvasHoverItem) {
        this.removeItem(this.canvasHoverItem);
      }
      this.canvasHoverItem = this.overlay.createComponent(
        CanvasHoverItemComponent,
      );
      this.addItem(this.canvasHoverItem.instance, canvasItem, element);
    }
  }

  setVisibility(visibility: 'visible' | 'hidden') {
    if (this.canvasSelectionItem) {
      this.canvasSelectionItem.instance.visibility = visibility;
      this.canvasSelectionItem.instance.ngOnChanges();
    }

    if (this.canvasHoverItem) {
      this.canvasHoverItem.instance.visibility = visibility;
      this.canvasHoverItem.instance.ngOnChanges();
    }
  }

  getSelectionCoordinates() {
    if (!this.selectedItem) {
      return;
    }

    const element: HTMLElement = this.getTargetElement(this.selectedItem);
    if (!element || !this.canvas) {
      return;
    }
    const canvasBoundingRect =
      this.canvas.nativeElement.getBoundingClientRect();
    const canvasItemBoundingRect = element.getBoundingClientRect();

    return {
      top: canvasItemBoundingRect.top - canvasBoundingRect.top,
      right: canvasBoundingRect.right - canvasItemBoundingRect.right,
    };
  }

  private getTargetElement(hoverFrame: CanvasItem) {
    return this.canvas?.nativeElement.querySelector(`#${hoverFrame?.key}`);
  }

  private addItem(
    component: SelectionItemComponent | CanvasHoverItemComponent,
    canvasItem: CanvasItem,
    element: HTMLElement,
  ) {
    component.width = element.offsetWidth;
    component.height = element.offsetHeight;
    component.top = element.offsetTop;
    component.left = element.offsetLeft;
    component.canvasItem = canvasItem;
    component.showAddButton = this.allowAdd;
    component.ngOnChanges();
  }

  private removeItem(
    item: ComponentRef<SelectionItemComponent | CanvasHoverItemComponent>,
  ) {
    const index = this.overlay.indexOf(item?.hostView);
    if (index != -1) {
      this.overlay.remove(index);
    }
  }
}
