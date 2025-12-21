import {
  Injectable,
  OnDestroy,
  inject,
  InjectionToken,
  signal,
} from '@angular/core';
import { UndoRedoService } from './undo-redo/undo-redo.service';
import { PresetProvider } from './interfaces/preset-provider.interface';
import { CanvasItem } from '@layout/models';
import { CanvasStore } from './canvas.store';
import { distinctUntilChanged, map, Subject, takeUntil } from 'rxjs';
import cloneDeep from 'lodash.clonedeep';
import { CANVAS_WRAPPER_ID } from './constants';
import { moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { CanvasItemType, InsertPosition } from './enums';
import { SelectionService } from './selection/selection.service';

import { Css } from '@layout/models';

export const PRESET_PROVIDER = new InjectionToken<PresetProvider>('PRESET_PROVIDER');

@Injectable()
export class CanvasService implements OnDestroy {
  private canvasStore = inject(CanvasStore);
  private undoRedoService = inject(UndoRedoService);
  private selectionService = inject(SelectionService);
  private presetsProvider = inject(PRESET_PROVIDER, { optional: true });

  private destroy$ = new Subject<boolean>();

  private canvasItemsChangedSubject = new Subject();
  canvasItemsChanged$ = this.canvasItemsChangedSubject.asObservable();

  private cssChangedSubject = new Subject();
  cssChanged$ = this.cssChangedSubject.asObservable();

  inspectorVisible = signal<boolean>(false);

  constructor() {
    this.subscribeToUndoRedo();
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
      map((state) => state.canvasItems),
    );
  }

  setItems(items: CanvasItem[], pushToUndoStack = true) {
    this.canvasStore.setItems(items);
    if (pushToUndoStack) {
      this.undoRedoService.takeSnapshot();
    }
  }

  toggleInspector(): void {
    this.inspectorVisible.set(!this.inspectorVisible());
  }

  insertItem(
    insertAfterFrameId: string,
    newFrame: CanvasItem,
    insertPosition: InsertPosition,
    autoSelect = true,
  ) {
    const updatedItems = this.canvasStore.insertItem(
      insertAfterFrameId,
      newFrame,
      insertPosition,
    );
    this.setItems(updatedItems, true);
    this.canvasItemsChangedSubject.next(undefined);
    if (autoSelect) {
      this.selectionService.setSelectedItemKey(newFrame.key);
    }
  }

  deleteItem(itemId: string | undefined) {
    if (!itemId) {
      return;
    }

    const updatedItems = this.canvasStore.deleteItem(itemId);
    this.setItems(updatedItems);
    this.canvasItemsChangedSubject.next(undefined);
    this.selectionService.setSelectedItemKey(undefined);
    this.selectionService.setHoverItemKey(undefined);
  }

  addPreset(
    presetId: string,
    targetItemId: string,
    insertPosition: InsertPosition,
    autoSelect = true,
  ) {
    if (!this.presetsProvider) {
      console.warn('PresetProvider not configured');
      return;
    }

    const preset = this.presetsProvider.getPreset(presetId);
    if (!preset) {
      return;
    }

    const newItem = cloneDeep(preset.presetDefinition);
    this.presetsProvider.assignDefaultPaddings(newItem);
    this.insertItem(targetItemId, newItem, insertPosition, autoSelect);
  }

  updateCss(css: Css) {
    const selectedFrame = this.selectionService.selectedItem;
    if (!selectedFrame) {
      return;
    }

    const updatedItems = this.canvasStore.updateItemCss(
      selectedFrame.key!,
      css,
    );
    this.setItems(updatedItems);
    this.cssChangedSubject.next(undefined);
  }

  moveItemChild(
    currentItemId: string | undefined,
    previousItemId: string,
    previousIndex: number,
    currentIndex: number,
  ) {
    if (
      currentItemId === previousItemId &&
      currentItemId === CANVAS_WRAPPER_ID
    ) {
      // moveItemInArray(this.items, previousIndex, currentIndex);
      this.setItems([...this.canvasStore.items]);
      return;
    }

    const currentContainer = this.canvasStore.getItemById(
      this.items,
      currentItemId,
    );
    const previousContainer = this.canvasStore.getItemById(
      this.items,
      previousItemId,
    );

    if (currentItemId === previousItemId && currentContainer?.children) {
      moveItemInArray(currentContainer?.children, previousIndex, currentIndex);
    } else if (previousContainer?.children && currentContainer?.children) {
      transferArrayItem(
        previousContainer?.children,
        currentContainer?.children,
        previousIndex,
        currentIndex,
      );
    }

    this.setItems([...this.canvasStore.items]);
  }

  updateTextContent(key: string, content: string) {
    const frame = this.canvasStore.getItemById(this.items, key);

    if (frame?.itemType !== CanvasItemType.TEXT || frame.content === content) {
      return;
    }

    const updatedItems = this.canvasStore.updateItemContent(key, content);
    this.setItems(updatedItems);
  }

  renameItem(name: string, id?: string) {
    const selectedItem = id
      ? this.canvasStore.getItemById(this.items, id)
      : this.selectionService.selectedItem;
    if (!selectedItem) {
      return;
    }

    const updatedItems = this.canvasStore.updateItemLabel(
      selectedItem.key!,
      name,
    );
    this.setItems(updatedItems);
  }

  removeAiWrapper(itemId: string): void {
    const item = this.canvasStore.getItemById(this.items, itemId);
    if (!item) {
      return;
    }

    const updatedItems = this.canvasStore.removeItemAiMetadata(itemId);
    this.setItems(updatedItems);
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

  private subscribeToUndoRedo() {
    this.undoRedoService.undoRedoExecuted$
      .pipe(takeUntil(this.destroy$))
      .subscribe((currentState: CanvasItem[]) => {
        this.canvasStore.setItems(currentState);
        this.selectionService.setSelectedItemKey(
          this.selectionService.selectedItem?.key,
        );
      });
  }
}
