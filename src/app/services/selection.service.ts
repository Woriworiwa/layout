import {ComponentRef, ElementRef, Injectable, ViewContainerRef} from "@angular/core";
import {CanvasStore} from "../store/canvas.store";
import {CanvasItem} from "../models/canvas-item.model";
import {CanvasSelectionItemComponent} from "../components/canvas/selection/canvas-selection-item.component";
import {CanvasHoverItemComponent} from "../components/canvas/selection/canvas-hover-item.component";
import {ContextMenuService} from "./context-menu.service";
import {PanZoomService} from "./pan-zoom.service";
import {DragDropService} from "./drag-drop.service";
import {BehaviorSubject, combineLatestWith, distinctUntilChanged, map, Observable} from "rxjs";

@Injectable()
export class SelectionService {
  overlay!: ViewContainerRef;
  canvas!: ElementRef;

  canvasSelectionItem: ComponentRef<CanvasSelectionItemComponent> | undefined = undefined
  canvasHoverItem: ComponentRef<CanvasHoverItemComponent> | undefined = undefined;

  private selectedItemId: BehaviorSubject<string | undefined> = new BehaviorSubject<string | undefined>(undefined);
  private selectedItemId$: Observable<string | undefined>;

  protected hoverCanvasItemIdSubject: BehaviorSubject<string | undefined> = new BehaviorSubject<string | undefined>(undefined);

  constructor(private canvasStore: CanvasStore,
              private panZoomService: PanZoomService,
              private contextMenuService: ContextMenuService,
              private dragDropService: DragDropService) {
    this.selectedItemId$ = this.selectedItemId.asObservable();
  }

  setSelectedItemKey(key: string | undefined) {
    this.selectedItemId.next(key);
  }

  setHoverItemKey(key: string | undefined) {
    this.hoverCanvasItemIdSubject.next(key);
  }

  get selectedItem() {
    return this.canvasStore.getItemById(undefined, this.selectedItemId.getValue());
  }

  get selectedItem$() {
    return this.selectedItemId$.pipe(
      map((selectedItemId) => this.canvasStore.getItemById(undefined, selectedItemId))
    )
  }

  initialize(overlay: ViewContainerRef, canvas: ElementRef) {
    this.overlay = overlay;
    this.canvas = canvas;

    this.selectedItem$
      .pipe(combineLatestWith(this.dragDropService.state$))
      .subscribe(([selectedFrame, dragDropState]) => {
          if ((!selectedFrame || dragDropState.isDragging) && this.canvasSelectionItem) {
            this.removeItem(this.canvasSelectionItem);
            this.canvasSelectionItem = undefined;
          } else {
            if (selectedFrame) {
              this.renderItem('selection', selectedFrame);
            }
          }
        }
      )

    this.hoverCanvasItemIdSubject.pipe(
      distinctUntilChanged(),
      map(hoverItemKey => this.canvasStore.getItemById(undefined, hoverItemKey))
    )
      .pipe(combineLatestWith(this.dragDropService.state$))
      .subscribe(([hoverFrame, dragDropState]) => {
          if (!hoverFrame && this.canvasHoverItem) {
            this.removeItem(this.canvasHoverItem);
            this.canvasHoverItem = undefined;
          } else {
            if (dragDropState.isDragging || this.panZoomService.isPanModeActive || !hoverFrame || !hoverFrame.key) {
              return;
            }

            if (this.selectedItem?.key === hoverFrame.key) {
              return;
            }

            this.renderItem('hover', hoverFrame);
          }
        }
      )
  }

  showContextMenu(event: any) {
    setTimeout(() => {
      if (this.canvasSelectionItem) {
        this.contextMenuService.show(this.canvasSelectionItem.instance.contextMenu.contextMenu, event)
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
      this.canvasSelectionItem = this.overlay.createComponent(CanvasSelectionItemComponent)
      this.addItem(this.canvasSelectionItem.instance, canvasItem, element);
    } else if (itemType === 'hover') {
      if (this.canvasHoverItem) {
        this.removeItem(this.canvasHoverItem);
      }
      this.canvasHoverItem = this.overlay.createComponent(CanvasHoverItemComponent)
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
    const canvasBoundingRect = this.canvas.nativeElement.getBoundingClientRect();
    const canvasItemBoundingRect = element.getBoundingClientRect();

    return {
      top: canvasItemBoundingRect.top - canvasBoundingRect.top,
      right: canvasBoundingRect.right - canvasItemBoundingRect.right
    }
  }

  private getTargetElement(hoverFrame: CanvasItem) {
    return this.canvas?.nativeElement.querySelector(`#${hoverFrame?.key}`);
  }

  private addItem(component: CanvasSelectionItemComponent | CanvasHoverItemComponent, canvasItem: CanvasItem, element: HTMLElement) {
    const canvasBoundingRect = this.canvas.nativeElement.getBoundingClientRect();
    const canvasItemBoundingRect = element.getBoundingClientRect();

    if (!canvasBoundingRect || !canvasItemBoundingRect) {
      return;
    }

    component.width = element.offsetWidth;
    component.height = element.offsetHeight;
    component.top = canvasItemBoundingRect.top - canvasBoundingRect.top;
    component.left = canvasItemBoundingRect.left - canvasBoundingRect.left;
    component.canvasItem = canvasItem;
    component.ngOnChanges();
  }

  private removeItem(item: ComponentRef<CanvasSelectionItemComponent | CanvasHoverItemComponent>) {
    const index = this.overlay.indexOf(item?.hostView)
    if (index != -1) {
      this.overlay.remove(index)
    }
  }
}
