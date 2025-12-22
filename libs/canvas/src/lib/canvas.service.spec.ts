import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { CanvasService } from './canvas.service';
import { CanvasStore } from './canvas.store';
import { SelectionService } from '@layout/canvas';
import { UndoRedoService } from '@layout/canvas';
import { ContextMenuService } from '@layout/canvas';
import { AssetDragDropService } from '@layout/canvas';
import { CanvasItem, CanvasItemType } from '@layout/models';
import { InsertPosition } from '@layout/models';
import { Css } from '@layout/models';

describe('CanvasService', () => {
  let service: CanvasService;
  let store: CanvasStore;
  let selectionService: SelectionService;
  let undoRedoService: UndoRedoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CanvasService,
        CanvasStore,
        SelectionService,
        UndoRedoService,
        ContextMenuService,
        AssetDragDropService,
      ],
    });

    service = TestBed.inject(CanvasService);
    store = TestBed.inject(CanvasStore);
    selectionService = TestBed.inject(SelectionService);
    undoRedoService = TestBed.inject(UndoRedoService);
  });

  describe('WHEN user inserts a new item', () => {
    it('SHOULD add item to store and select it', async () => {
      const container: CanvasItem = {
        key: 'container-1',
        itemType: CanvasItemType.FLEX,
        children: [],
      };
      store.setItems([container]);

      const newItem: CanvasItem = {
        key: 'text-1',
        itemType: CanvasItemType.TEXT,
        children: [],
      };

      service.insertItem('container-1', newItem, InsertPosition.INSIDE);

      const items = await firstValueFrom(service.items$);
      expect(items[0].children).toHaveLength(1);
      expect(items[0].children?.[0].key).toBe(newItem.key);
      expect(selectionService.selectedItem?.key).toBe(newItem.key);
    });

    it('SHOULD trigger undo snapshot after insertion', () => {
      const container: CanvasItem = {
        key: 'container-1',
        itemType: CanvasItemType.FLEX,
        children: [],
      };
      store.setItems([container]);

      const newItem: CanvasItem = {
        key: 'text-1',
        itemType: CanvasItemType.TEXT,
        children: [],
      };
      const snapshotSpy = vi.spyOn(undoRedoService, 'takeSnapshot');

      service.insertItem('container-1', newItem, InsertPosition.INSIDE);

      expect(snapshotSpy).toHaveBeenCalled();
    });
  });

  describe('WHEN user deletes an item', () => {
    it('SHOULD remove item from store and clear selection', async () => {
      const container: CanvasItem = {
        key: 'container-1',
        itemType: CanvasItemType.FLEX,
        children: [
          { key: 'child-1', itemType: CanvasItemType.TEXT, children: [] },
        ],
      };
      store.setItems([container]);
      selectionService.setSelectedItemKey('child-1');

      service.deleteItem('child-1');

      const items = await firstValueFrom(service.items$);
      expect(items[0].children).toHaveLength(0);
      expect(selectionService.selectedItem).toBeUndefined();
    });

    it('SHOULD trigger undo snapshot after deletion', () => {
      const item: CanvasItem = {
        key: 'item-1',
        itemType: CanvasItemType.TEXT,
        children: [],
      };
      store.setItems([item]);
      const snapshotSpy = vi.spyOn(undoRedoService, 'takeSnapshot');

      service.deleteItem(item.key);

      expect(snapshotSpy).toHaveBeenCalled();
    });
  });

  describe('WHEN user updates item CSS', () => {
    it('SHOULD persist changes to store', async () => {
      const item: CanvasItem = {
        key: 'item-1',
        itemType: CanvasItemType.TEXT,
        css: {},
        children: [],
      };
      store.setItems([item]);
      selectionService.setSelectedItemKey(item.key);
      const newCss: Css = { display: { display: 'flex' } };

      service.updateCss(newCss);

      const items = await firstValueFrom(service.items$);
      expect(items[0].css).toEqual(newCss);
    });

    it('SHOULD trigger undo snapshot after CSS update', () => {
      const item: CanvasItem = {
        key: 'item-1',
        itemType: CanvasItemType.TEXT,
        css: {},
        children: [],
      };
      store.setItems([item]);
      selectionService.setSelectedItemKey(item.key);
      const snapshotSpy = vi.spyOn(undoRedoService, 'takeSnapshot');
      const newCss: Css = { display: { display: 'block' } };

      service.updateCss(newCss);

      expect(snapshotSpy).toHaveBeenCalled();
    });
  });

  describe('WHEN user updates text content', () => {
    it('SHOULD persist content to store', async () => {
      const textItem: CanvasItem = {
        key: 'text-1',
        itemType: CanvasItemType.TEXT,
        content: 'old text',
        children: [],
      };
      store.setItems([textItem]);

      service.updateTextContent('text-1', 'new text');

      const items = await firstValueFrom(service.items$);
      expect(items[0].content).toBe('new text');
    });
  });

  describe('WHEN user renames an item', () => {
    it('SHOULD update item label in store', async () => {
      const item: CanvasItem = {
        key: 'item-1',
        itemType: CanvasItemType.TEXT,
        label: 'Old Label',
        children: [],
      };
      store.setItems([item]);

      service.renameItem('New Label', item.key);

      const items = await firstValueFrom(service.items$);
      expect(items[0].label).toBe('New Label');
    });
  });

  describe('WHEN user pastes an item', () => {
    it('SHOULD duplicate item and insert after target', async () => {
      const item1: CanvasItem = {
        key: 'item-1',
        itemType: CanvasItemType.TEXT,
        children: [],
      };
      const item2: CanvasItem = {
        key: 'item-2',
        itemType: CanvasItemType.TEXT,
        children: [],
      };
      store.setItems([item1, item2]);

      service.pasteItem(item1.key, item2.key);

      const items = await firstValueFrom(service.items$);
      expect(items).toHaveLength(3);
      expect(items[2].itemType).toBe(item1.itemType);
    });
  });

  describe('WHEN store state changes', () => {
    it('SHOULD emit updated items through observable', async () => {
      const initialItem: CanvasItem = {
        key: 'initial',
        itemType: CanvasItemType.TEXT,
        children: [],
      };
      const updatedItem: CanvasItem = {
        key: 'updated',
        itemType: CanvasItemType.TEXT,
        children: [],
      };

      store.setItems([initialItem]);
      const firstEmit = await firstValueFrom(service.items$);
      expect(firstEmit).toEqual([initialItem]);

      store.setItems([updatedItem]);
      const secondEmit = await firstValueFrom(service.items$);
      expect(secondEmit).toEqual([updatedItem]);
    });
  });
});
