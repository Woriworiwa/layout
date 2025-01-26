import {Injectable, OnDestroy} from "@angular/core";
import {UndoRedoService} from "../core/undo-redo/undo-redo.service";
import {PresetsService} from "../panels/insert/presets.service";
import {CanvasItem} from "../core/models/canvas-item.model";
import {CanvasStore} from "../core/store/canvas.store";
import {distinctUntilChanged, map, Subject, takeUntil} from "rxjs";
import cloneDeep from "lodash.clonedeep";
import {CANVAS_WRAPPER_ID} from "../core/models/constants";
import {Css} from "../core/models/css.model";
import {moveItemInArray, transferArrayItem} from "@angular/cdk/drag-drop";
import {CanvasItemType, InsertPosition} from "../core/models/enums";
import {SelectionService} from "./selection/selection.service";
import {DragDropService} from "./drag-drop.service";

@Injectable()
export class CanvasService implements OnDestroy {
  private destroy$ = new Subject<boolean>();
  private cssChangedSubject = new Subject();
  cssChanged$ = this.cssChangedSubject.asObservable();

  constructor(private canvasStore: CanvasStore,
              private undoRedoService: UndoRedoService,
              private selectionService: SelectionService,
              private presetsService: PresetsService,
              private dragDropService: DragDropService) {
    this.undoRedoService.undoRedoExecuted$
      .pipe(takeUntil(this.destroy$))
      .subscribe((currentState: CanvasItem[]) => {
        this.canvasStore.setItems(currentState);
        this.selectionService.setSelectedItemKey(this.selectionService.selectedItem?.key);
      })

    this.dragDropService.drop$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.undoRedoService.takeSnapshot();
        this.setItems([...this.canvasStore.items]);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  get items() {
    return this.canvasStore.items;
  }

  get items$() {
    return this.canvasStore.state.pipe(
      distinctUntilChanged(),
      map(state => state.canvasItems)
    )
  }

  setItems(items: CanvasItem[], pushToUndoStack = true) {
    this.canvasStore.setItems(items)

    if (pushToUndoStack) {
      this.undoRedoService.takeSnapshot();
    }
  }

  insertItem(insertAfterFrameId: string, newFrame: CanvasItem, insertPosition: InsertPosition) {
    this.canvasStore.insertItem(insertAfterFrameId, newFrame, insertPosition);
    this.selectionService.setSelectedItemKey(newFrame.key);
    this.undoRedoService.takeSnapshot();
  }

  deleteItem(itemId: string | undefined) {
    if (!itemId) {
      return;
    }

    const parentItemKey = this.canvasStore.getParentItemKey(itemId, this.canvasStore.items, CANVAS_WRAPPER_ID);
    let items: CanvasItem[] = []
    if (parentItemKey === CANVAS_WRAPPER_ID) {
      items = this.canvasStore.items;
    } else {
      const parentItem = this.canvasStore.getItemById(this.canvasStore.items, parentItemKey);

      if (!parentItem) {
        return;
      }

      items = parentItem.children || [];
    }

    const index = items.findIndex(item => item.key === itemId);

    if (index < 0) {
      return;
    }

    if (index > -1) {
      items.splice(index, 1);
    }

    // TODO: find a better way to update the items
    this.setItems(cloneDeep(this.canvasStore.items));

    this.selectionService.setSelectedItemKey(undefined);
    this.selectionService.setHoverItemKey(undefined);
  }

  addPreset(presetId: string, targetItemId: string, insertPosition: InsertPosition) {
    const preset = this.presetsService.getPreset(presetId);

    if (!preset) {
      return;
    }

    const newItem = cloneDeep(preset.presetDefinition);

    this.presetsService.assignDefaultPaddings(newItem);

    this.insertItem(targetItemId, newItem, insertPosition);
  }

  updateCss(css: Css) {
    const selectedFrame = this.selectionService.selectedItem;

    if (!selectedFrame) {
      return;
    }

    selectedFrame.css = css;

    this.undoRedoService.takeSnapshot();
    this.cssChangedSubject.next(undefined);
  }

  moveItemChild(currentItemId: string | undefined, previousItemId: string, previousIndex: number, currentIndex: number) {
    if (currentItemId === previousItemId && currentItemId === CANVAS_WRAPPER_ID) {
      // moveItemInArray(this.items, previousIndex, currentIndex);
      this.setItems([...this.canvasStore.items]);
      return;
    }

    const currentContainer = this.canvasStore.getItemById(this.items, currentItemId);
    const previousContainer = this.canvasStore.getItemById(this.items, previousItemId);

    if (currentItemId === previousItemId && currentContainer?.children) {
      moveItemInArray(currentContainer?.children, previousIndex, currentIndex);
    } else if (previousContainer?.children && currentContainer?.children) {
      transferArrayItem(previousContainer?.children, currentContainer?.children, previousIndex, currentIndex);
    }

    this.setItems([...this.canvasStore.items]);
  }

  updateTextContent(key: string, content: string) {
    const frame = this.canvasStore.getItemById(this.items, key);

    if (frame?.itemType !== CanvasItemType.TEXT || frame.content === content) {
      return;
    }

    frame.content = content;
    this.canvasStore.setItems(cloneDeep(this.items));

    this.undoRedoService.takeSnapshot();
  }

  renameItem(name: string, id?: string) {
    const selectedItem = id ? this.canvasStore.getItemById(this.items, id) : this.selectionService.selectedItem;
    if (!selectedItem) {
      return;
    }

    selectedItem.label = name;

    this.canvasStore.setItems(cloneDeep(this.items));
    this.undoRedoService.takeSnapshot();
  }

  pasteItem(copyItemId: string | undefined, pasteItemId: string | undefined) {
    if (!copyItemId || !pasteItemId) {
      return;
    }

    const copyItem = this.canvasStore.getItemById(this.items, copyItemId);

    if (!copyItem) {
      return;
    }

    const duplicatedItem = cloneDeep(copyItem);

    this.insertItem(pasteItemId, duplicatedItem, InsertPosition.AFTER);
  }
}
