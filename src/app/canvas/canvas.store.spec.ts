import {TestBed} from '@angular/core/testing';
import {CanvasStore} from './canvas.store';
import {CanvasItem} from '../core/models/canvas-item.model';
import {CanvasItemType, InsertPosition} from "../core/enums";
import {CANVAS_WRAPPER_ID} from "../core/constants";
import { vi } from 'vitest';

describe('CanvasStore', () => {
  let store: CanvasStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CanvasStore]
    });
    store = TestBed.inject(CanvasStore);
  });

  describe('getParentItemKey', () => {
    it('should return undefined if no matching key is found', () => {
      const frames: CanvasItem[] = [
        {key: '1', children: [], itemType: CanvasItemType.FLEX},
        {key: '2', children: [], itemType: CanvasItemType.FLEX}
      ];
      const result = store.getParentItemKey('3', frames, undefined);
      expect(result).toBeUndefined();
    });

    it('should return the parent key if the child key is found', () => {
      const frames: CanvasItem[] = [
        {
          key: '1',
          itemType: CanvasItemType.FLEX,
          children: [{key: '1.1', children: [], itemType: CanvasItemType.FLEX}]
        },
        {key: '2', itemType: CanvasItemType.FLEX, children: []}
      ];
      const result = store.getParentItemKey('1.1', frames, undefined);
      expect(result).toBe('1');
    });

    it('should return the grandparent key if the child key is found in nested children', () => {
      const frames: CanvasItem[] = [
        {
          key: '1',
          itemType: CanvasItemType.FLEX,
          children: [{
            key: '1.1',
            itemType: CanvasItemType.FLEX,
            children: [{key: '1.1.1', itemType: CanvasItemType.FLEX, children: []}]
          }]
        },
        {key: '2', itemType: CanvasItemType.FLEX, children: []}
      ];
      const result = store.getParentItemKey('1.1.1', frames, undefined);
      expect(result).toBe('1.1');
    });

    it('should return the correct parent key for deeply nested children', () => {
      const frames: CanvasItem[] = [
        {
          key: '1',
          itemType: CanvasItemType.FLEX,
          children: [{
            key: '1.1',
            itemType: CanvasItemType.FLEX,
            children: [{
              key: '1.1.1',
              itemType: CanvasItemType.FLEX,
              children: [{key: '1.1.1.1', itemType: CanvasItemType.FLEX, children: []}]
            }]
          }]
        },
        {key: '2', children: [], itemType: CanvasItemType.FLEX}
      ];
      const result = store.getParentItemKey('1.1.1.1', frames, undefined);
      expect(result).toBe('1.1.1');
    });
  });

  describe('getItemById', () => {
    it('should return undefined if no matching key is found', () => {
      const frames: CanvasItem[] = [
        { key: '1', children: [], itemType: CanvasItemType.FLEX },
        { key: '2', children: [], itemType: CanvasItemType.FLEX }
      ];
      const result = store.getItemById(frames, '3');
      expect(result).toBeUndefined();
    });

    it('should return the correct item by key', () => {
      const frames: CanvasItem[] = [
        { key: '1', children: [], itemType: CanvasItemType.FLEX },
        { key: '2', children: [], itemType: CanvasItemType.FLEX }
      ];
      const result = store.getItemById(frames, '2');
      expect(result).toEqual(frames[1]);
    });

    it('should return the correct nested item by key', () => {
      const frames: CanvasItem[] = [
        { key: '1', itemType: CanvasItemType.FLEX, children: [{ key: '1.1', children: [], itemType: CanvasItemType.FLEX }] },
        { key: '2', children: [], itemType: CanvasItemType.FLEX }
      ];
      const result = store.getItemById(frames, '1.1');
      expect(result).toEqual(frames[0].children![0]);
    });

    it('should return the correct deeply nested item by key', () => {
      const frames: CanvasItem[] = [
        {
          key: '1',
          itemType: CanvasItemType.FLEX,
          children: [{
            key: '1.1',
            itemType: CanvasItemType.FLEX,
            children: [{ key: '1.1.1', itemType: CanvasItemType.FLEX, children: [] }]
          }]
        },
        { key: '2', children: [], itemType: CanvasItemType.FLEX }
      ];
      const result = store.getItemById(frames, '1.1.1');
      expect(result).toEqual(frames[0].children![0].children![0]);
    });

    it('should return undefined if frames is undefined', () => {
      const result = store.getItemById(undefined, '1');
      expect(result).toBeUndefined();
    });

    it('should return undefined if key is undefined', () => {
      const frames: CanvasItem[] = [
        { key: '1', children: [], itemType: CanvasItemType.FLEX },
        { key: '2', children: [], itemType: CanvasItemType.FLEX }
      ];
      const result = store.getItemById(frames, undefined);
      expect(result).toBeUndefined();
    });

    it('should return the correct child item by key', () => {
      const frames: CanvasItem[] = [
        {
          key: '1',
          itemType: CanvasItemType.FLEX,
          children: [
            { key: '1.1', itemType: CanvasItemType.FLEX, children: [] },
            { key: '1.2', itemType: CanvasItemType.FLEX, children: [] }
          ]
        },
        { key: '2', children: [], itemType: CanvasItemType.FLEX }
      ];
      const result = store.getItemById(frames, '1.2');
      expect(result).toEqual(frames[0].children![1]);
    });

    it('should return the correct deeply nested child item by key', () => {
      const frames: CanvasItem[] = [
        {
          key: '1',
          itemType: CanvasItemType.FLEX,
          children: [{
            key: '1.1',
            itemType: CanvasItemType.FLEX,
            children: [{
              key: '1.1.1',
              itemType: CanvasItemType.FLEX,
              children: [{ key: '1.1.1.1', itemType: CanvasItemType.FLEX, children: [] }]
            }]
          }]
        },
        { key: '2', children: [], itemType: CanvasItemType.FLEX }
      ];
      const result = store.getItemById(frames, '1.1.1.1');
      expect(result).toEqual(frames[0].children![0].children![0].children![0]);
    });
  });

  describe('insertItem', () => {
    it('should insert item inside another item', () => {
      const frames: CanvasItem[] = [{ key: '1', children: [], itemType: CanvasItemType.FLEX }];
      store.setItems(frames);
      const newItem: CanvasItem = { key: '1.1', children: [], itemType: CanvasItemType.FLEX };
      store.insertItem('1', newItem, InsertPosition.INSIDE);
      expect(store.items[0].children).toEqual([newItem]);
    });

    it('should insert item after another item', () => {
      const frames: CanvasItem[] = [{ key: '1', children: [], itemType: CanvasItemType.FLEX }];
      store.setItems(frames);
      const newItem: CanvasItem = { key: '2', children: [], itemType: CanvasItemType.FLEX };
      store.insertItem('1', newItem, InsertPosition.AFTER);
      expect(store.items[1]).toEqual(newItem);
    });

    it('should insert item before another item', () => {
      const frames: CanvasItem[] = [{ key: '1', children: [], itemType: CanvasItemType.FLEX }];
      store.setItems(frames);
      const newItem: CanvasItem = { key: '0', children: [], itemType: CanvasItemType.FLEX };
      store.insertItem('1', newItem, InsertPosition.BEFORE);
      expect(store.items[0]).toEqual(newItem);
      expect(store.items[1].key).toBe('1');
    });

    it('should insert item at the root level if no parent is specified', () => {
      // Mock the generateUniqueId method to return predictable values
      vi.spyOn(store as any, 'generateUniqueId').mockReturnValue('mockedId');

      const frames: CanvasItem[] = [{ key: '1', children: [], itemType: CanvasItemType.FLEX }];
      store.setItems(frames);
      const newItem: CanvasItem = { key: 'mockedId', children: [], itemType: CanvasItemType.FLEX };
      store.insertItem(CANVAS_WRAPPER_ID, newItem, InsertPosition.AFTER);
      expect(store.items[1]).toEqual(newItem);
    });

    it('should insert item after a nested item', () => {
      const frames: CanvasItem[] = [
        { key: '1', children: [{ key: '1.1', children: [], itemType: CanvasItemType.FLEX }], itemType: CanvasItemType.FLEX }
      ];
      store.setItems(frames);
      const newItem: CanvasItem = { key: '1.2', children: [], itemType: CanvasItemType.FLEX };
      store.insertItem('1.1', newItem, InsertPosition.AFTER);
      expect(store.items[0].children![1]).toEqual(newItem);
    });

    it('should insert item before a nested item', () => {
      const frames: CanvasItem[] = [
        { key: '1', children: [{ key: '1.2', children: [], itemType: CanvasItemType.FLEX }], itemType: CanvasItemType.FLEX }
      ];
      store.setItems(frames);
      const newItem: CanvasItem = { key: '1.1', children: [], itemType: CanvasItemType.FLEX };
      store.insertItem('1.2', newItem, InsertPosition.BEFORE);
      expect(store.items[0].children![0]).toEqual(newItem);
      expect(store.items[0].children![1].key).toBe('1.2');
    });

    it('should insert item inside a nested item', () => {
      const frames: CanvasItem[] = [
        { key: '1', children: [{ key: '1.1', children: [], itemType: CanvasItemType.FLEX }], itemType: CanvasItemType.FLEX }
      ];
      store.setItems(frames);
      const newItem: CanvasItem = { key: '1.1.1', children: [], itemType: CanvasItemType.FLEX };
      store.insertItem('1.1', newItem, InsertPosition.INSIDE);
      expect(store.items[0].children![0].children).toEqual([newItem]);
    });
  });
});
