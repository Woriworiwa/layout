import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  Input,
  OnDestroy,
  ViewChild,
  DOCUMENT,
  inject,
} from '@angular/core';
import { ContainerComponent } from './canvas-items/container/container.component';
import { CanvasItem } from '@layout/models';
import { CANVAS_WRAPPER_ID } from './constants';
import { ContextMenuService } from './context-menu/context-menu.service';
import { SelectionService } from './selection/selection.service';
import { CanvasToolbarComponent } from './toolbar/canvas-toolbar.component';
import { PanZoomService } from './pan-zoom/pan-zoom.service';
import { CopyPasteService } from './copy-paste/copy-paste.service';
import { KeyboardCommandsDirective } from './keyboard/keyboard-commands.directive';
import { CanvasService } from './canvas.service';
import { PanZoomDirective } from './pan-zoom/pan-zoom.directive';
import { Subject, takeUntil } from 'rxjs';
import { MetaLayerService } from './meta-layer/meta-layer.service';
import { SelectionLayerComponent } from './selection/selection-layer.component';
import { MetaLayerComponent } from './meta-layer/meta-layer.component';
import { CanvasItemMouseEvent } from './canvas-items/canvas-item-mouse-event';
import { CanvasSettings } from './canvas.settings';
import { DragDropService } from './drag-drop/drag-drop.service';
import { CanvasDropZoneDirective } from './drag-drop/canvas-drop-zone.directive';

@Component({
  selector: 'app-canvas',
  imports: [
    ContainerComponent,
    CanvasToolbarComponent,
    SelectionLayerComponent,
    MetaLayerComponent,
  ],
  providers: [
    CopyPasteService,
    PanZoomService,
    MetaLayerService,
    DragDropService,
  ],
  hostDirectives: [
    KeyboardCommandsDirective,
    PanZoomDirective,
    CanvasDropZoneDirective,
  ],
  host: {
    '[class.surface-100]': 'true',
    'data-testid': 'canvas-component',
  },
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss'],
})
export class CanvasComponent implements AfterViewInit, OnDestroy {
  @Input()
  settings: CanvasSettings = new CanvasSettings({ allowAdd: true });

  private canvasService = inject(CanvasService);
  private selectionService = inject(SelectionService);
  private contextMenuService = inject(ContextMenuService);
  private panZoomService = inject(PanZoomService);
  private document = inject<Document>(DOCUMENT);
  private dragDropService = inject(DragDropService);

  readonly CANVAS_WRAPPER_ID = CANVAS_WRAPPER_ID;
  rootItems: CanvasItem[] = [];

  private destroy$ = new Subject<boolean>();

  @ViewChild('wrapper')
  wrapperElementRef!: ElementRef;

  constructor() {
    this.canvasService.items$
      .pipe(takeUntil(this.destroy$))
      .subscribe((items) => {
        this.rootItems = items;
      });

    this.canvasService.canvasItemsChanged$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.rootItems = this.canvasService.items;
        /* focus the selected frame, most of the times the focus will be set by the mouse when the user clicks on an item,
         * but when programatically add new items, we need to focus them.
         * Items should be focused in order to listen to keyboard events*/
        /*TODO: Find another way other than setTimeout*/
        setTimeout(() => {
          this.document
            .getElementById(`${this.selectionService.selectedItem?.key}`)
            ?.focus();
        }, 0);
      });
  }

  ngAfterViewInit() {
    this.panZoomService.initialize(this.wrapperElementRef);
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
    this.dragDropService.destroy();
  }

  /*click*/
  @HostListener('click')
  clearSelection() {
    this.selectionService.setSelectedItemKey(undefined);
    this.contextMenuService.hide();
  }

  selectElement(event: CanvasItemMouseEvent) {
    if (this.panZoomService.isPanModeActive) {
      return;
    }

    this.selectionService.setSelectedItemKey(event.canvasItem.key);
    this.contextMenuService.hide();
  }

  hoverElement(event: CanvasItemMouseEvent) {
    if (this.panZoomService.isPanning || this.panZoomService.isPanModeActive) {
      return;
    }

    this.selectionService.setHoverItemKey(event.canvasItem.key);
  }

  clearHover() {
    this.selectionService.setHoverItemKey(undefined);
  }

  onContextMenu(event: CanvasItemMouseEvent) {
    this.selectionService.setSelectedItemKey(event.canvasItem.key);
    this.selectionService.showContextMenu(event.mouseEvent);
  }

  onTextItemContentChanged(content: { key: string; content: string }) {
    this.canvasService.updateTextContent(content.key, content.content);
  }
}
