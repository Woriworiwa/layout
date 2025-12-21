import { beforeEach, describe, expect, it } from 'vitest';
import { CssClassSerializer } from './css-class.serializer';
import { CanvasItem, CanvasItemType } from '@layout/models';

describe('CssClassSerializer', () => {
  let serializer: CssClassSerializer;

  beforeEach(() => {
    serializer = new CssClassSerializer();
  });

  describe('WHEN serializing a single item with CSS properties', () => {
    it('SHOULD generate class with CSS rules', () => {
      const item: CanvasItem = {
        itemType: CanvasItemType.FLEX,
        key: 'abc123',
        label: 'Container',
        css: {
          display: { display: 'flex' },
          boxSizing: { padding: '1rem' }
        },
        children: []
      };

      const result = serializer.serialize([item]);
      const css = result.join('\n');

      expect(css).toContain('.abc123');
      expect(css).toContain('display: flex');
      expect(css).toContain('padding: 1rem');
    });
  });

  describe('WHEN serializing items with nested children', () => {
    it('SHOULD generate classes for all items in hierarchy', () => {
      const parent: CanvasItem = {
        itemType: CanvasItemType.FLEX,
        key: 'parent',
        label: 'Parent',
        css: {
          display: { display: 'grid' }
        },
        children: [
          {
            itemType: CanvasItemType.FLEX,
            key: 'child1',
            label: 'Child 1',
            css: {
              gridItem: { gridColumn: '1 / 2' }
            },
            children: []
          }
        ]
      };

      const result = serializer.serialize([parent]);
      const css = result.join('\n');

      expect(css).toContain('.parent');
      expect(css).toContain('.child1');
    });
  });

  describe('WHEN serializing items with empty CSS', () => {
    it('SHOULD return empty array', () => {
      const item: CanvasItem = {
        itemType: CanvasItemType.FLEX,
        key: 'empty-css',
        label: 'Empty',
        css: undefined,
        children: []
      };

      const result = serializer.serialize([item]);

      expect(result).toBeInstanceOf(Array);
      expect(result.length).toBe(0);
    });
  });

  describe('WHEN serializing empty array', () => {
    it('SHOULD return empty array', () => {
      const result = serializer.serialize([]);

      expect(result).toBeInstanceOf(Array);
      expect(result.length).toBe(0);
    });
  });

  describe('WHEN serializing multiple root items', () => {
    it('SHOULD generate classes for each item', () => {
      const items: CanvasItem[] = [
        {
          itemType: CanvasItemType.FLEX,
          key: 'item1',
          label: 'Item 1',
          css: {
            boxSizing: { width: '100px' }
          },
          children: []
        },
        {
          itemType: CanvasItemType.FLEX,
          key: 'item2',
          label: 'Item 2',
          css: {
            boxSizing: { height: '200px' }
          },
          children: []
        }
      ];

      const result = serializer.serialize(items);
      const css = result.join('\n');

      expect(css).toContain('.item1');
      expect(css).toContain('.item2');
    });
  });
});
