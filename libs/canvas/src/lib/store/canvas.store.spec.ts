import { describe, it, expect, beforeEach } from 'vitest';
import { CanvasStore } from './canvas.store';
import { CanvasItem, CanvasItemType } from '@layout/models';
import { InsertPosition } from '@layout/models';

describe('CanvasStore', () => {
  let store: CanvasStore;

  beforeEach(() => {
    store = new CanvasStore();
  });

  describe('WHEN finding items in tree', () => {
    it('SHOULD find item by ID at any depth', () => {
      const items: CanvasItem[] = [
        {
          key: 'parent',
          itemType: CanvasItemType.CONTAINER,
          children: [
            { key: 'child', itemType: CanvasItemType.TEXT, children: [] },
          ],
        },
      ];
      store.setItems(items);

      const found = store.getItemById(store.items, 'child');

      expect(found?.key).toBe('child');
    });

    it('SHOULD find parent key for nested items', () => {
      const items: CanvasItem[] = [
        {
          key: 'parent',
          itemType: CanvasItemType.CONTAINER,
          children: [
            { key: 'child', itemType: CanvasItemType.TEXT, children: [] },
          ],
        },
      ];

      const parentKey = store.getParentItemKey('child', items, undefined);

      expect(parentKey).toBe('parent');
    });

    it('SHOULD return undefined for non-existent items', () => {
      const items: CanvasItem[] = [
        { key: 'item1', itemType: CanvasItemType.CONTAINER, children: [] },
      ];

      expect(store.getItemById(items, 'missing')).toBeUndefined();
      expect(
        store.getParentItemKey('missing', items, undefined),
      ).toBeUndefined();
    });
  });

  describe('WHEN inserting items', () => {
    it('SHOULD return new array without mutating original', () => {
      const items: CanvasItem[] = [
        { key: 'item1', itemType: CanvasItemType.CONTAINER, children: [] },
      ];
      store.setItems(items);
      const newItem: CanvasItem = {
        itemType: CanvasItemType.TEXT,
        children: [],
      };

      const result = store.insertItem('item1', newItem, InsertPosition.AFTER);

      // Returns new array
      expect(result).not.toBe(store.items);
      expect(result).toHaveLength(2);

      // Original unchanged until setItems called
      expect(store.items).toHaveLength(1);

      // Setting result updates state
      store.setItems(result);
      expect(store.items).toHaveLength(2);
      expect(store.items[1].itemType).toBe(CanvasItemType.TEXT);
    });

    it('SHOULD insert at different positions (INSIDE, BEFORE, AFTER)', () => {
      const parent: CanvasItem[] = [
        { key: 'parent', itemType: CanvasItemType.CONTAINER, children: [] },
      ];
      store.setItems(parent);

      const insideResult = store.insertItem(
        'parent',
        { itemType: CanvasItemType.TEXT, children: [] },
        InsertPosition.INSIDE,
      );
      expect(insideResult[0].children).toHaveLength(1);

      store.setItems(insideResult);

      const child1Key = store.items[0].children?.[0].key;
      expect(child1Key).toBeDefined()
      if (!child1Key) {
        return;
      }

      const beforeResult = store.insertItem(
        child1Key,
        { itemType: CanvasItemType.TEXT, children: [] },
        InsertPosition.BEFORE,
      );
      expect(beforeResult[0].children).toHaveLength(2);
      expect(beforeResult[0].children?.[1].key).toBe(child1Key);
    });
  });

  describe('WHEN updating items', () => {
    it('SHOULD return new array with CSS updated', () => {
      const items: CanvasItem[] = [
        { key: 'item1', itemType: CanvasItemType.TEXT, css: {}, children: [] },
      ];
      store.setItems(items);
      const newCss = { display: { display: 'block' } };

      const result = store.updateItemCss('item1', newCss);

      // Original unchanged
      expect(store.items[0].css).toEqual({});

      // Result has new CSS
      expect(result[0].css).toEqual(newCss);
    });

    it('SHOULD update content and label', () => {
      const items: CanvasItem[] = [
        {
          key: 'text',
          itemType: CanvasItemType.TEXT,
          content: 'old',
          label: 'Old Label',
          children: [],
        },
      ];
      store.setItems(items);

      const contentResult = store.updateItemContent('text', 'new content');
      const labelResult = store.updateItemLabel('text', 'New Label');

      expect(contentResult[0].content).toBe('new content');
      expect(labelResult[0].label).toBe('New Label');
      expect(store.items[0].content).toBe('old'); // Original unchanged
    });
  });

  describe('WHEN deleting items', () => {
    it('SHOULD return new array with item removed', () => {
      const items: CanvasItem[] = [
        { key: 'item1', itemType: CanvasItemType.CONTAINER, children: [] },
        { key: 'item2', itemType: CanvasItemType.CONTAINER, children: [] },
      ];
      store.setItems(items);

      const result = store.deleteItem('item1');

      // Original unchanged
      expect(store.items).toHaveLength(2);

      // Result has item removed
      expect(result).toHaveLength(1);
      expect(result[0].key).toBe('item2');
    });
  });

  describe('WHEN working with deeply nested structures', () => {
    it('SHOULD traverse and manipulate items at any depth', () => {
      // Create 4-level deep structure
      const deepItems: CanvasItem[] = [
        {
          key: 'level1',
          itemType: CanvasItemType.CONTAINER,
          children: [
            {
              key: 'level2',
              itemType: CanvasItemType.CONTAINER,
              children: [
                {
                  key: 'level3',
                  itemType: CanvasItemType.CONTAINER,
                  children: [
                    {
                      key: 'level4',
                      itemType: CanvasItemType.TEXT,
                      children: [],
                      content: 'deep',
                    },
                  ],
                },
              ],
            },
          ],
        },
      ];
      store.setItems(deepItems);

      // Find deeply nested item
      const found = store.getItemById(store.items, 'level4');
      expect(found?.content).toBe('deep');

      // Find parent at depth
      const parentKey = store.getParentItemKey(
        'level4',
        store.items,
        undefined,
      );
      expect(parentKey).toBe('level3');

      // Update deeply nested item
      const updatedItems = store.updateItemContent(
        'level4',
        'updated deep content',
      );
      const updatedItem = store.getItemById(updatedItems, 'level4');
      expect(updatedItem?.content).toBe('updated deep content');
      expect(
        store.items[0].children?.[0].children?.[0].children?.[0].content,
      ).toBe('deep'); // Original unchanged
    });

    it('SHOULD insert and delete at deep nesting levels', () => {
      const deepItems: CanvasItem[] = [
        {
          key: 'root',
          itemType: CanvasItemType.CONTAINER,
          children: [
            {
              key: 'branch',
              itemType: CanvasItemType.CONTAINER,
              children: [
                { key: 'leaf', itemType: CanvasItemType.TEXT, children: [] },
              ],
            },
          ],
        },
      ];
      store.setItems(deepItems);

      // Insert at depth
      const insertResult = store.insertItem(
        'leaf',
        { itemType: CanvasItemType.TEXT, children: [] },
        InsertPosition.AFTER,
      );
      expect(insertResult[0].children?.[0].children).toHaveLength(2);

      // Delete from depth
      store.setItems(insertResult);
      const deleteResult = store.deleteItem('leaf');
      expect(deleteResult[0].children?.[0].children).toHaveLength(1);
    });
  });

  describe('WHEN state changes', () => {
    it('SHOULD only emit when setItems is called', () => {
      let emitCount = 0;

      store.state.subscribe(() => {
        emitCount++;
      });

      // Pure functions don't trigger emissions
      store.insertItem(
        'test',
        { itemType: CanvasItemType.TEXT, children: [] },
        InsertPosition.AFTER,
      );
      expect(emitCount).toBe(1); // Only initial subscription

      // setItems triggers emission
      store.setItems([]);
      expect(emitCount).toBe(2);
    });
  });
});
