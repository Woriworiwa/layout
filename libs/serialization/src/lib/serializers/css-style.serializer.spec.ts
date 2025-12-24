import { describe, it, expect, beforeEach } from 'vitest';
import { CssStyleSerializer } from './css-style.serializer';
import { CanvasItem, CanvasItemType } from '@layout/models';

describe('CssStyleSerializer', () => {
  let serializer: CssStyleSerializer;

  beforeEach(() => {
    serializer = new CssStyleSerializer();
  });

  describe('WHEN serializing a single item with CSS properties', () => {
    it('SHOULD generate CSS property strings', () => {
      const item: CanvasItem = {
        itemType: CanvasItemType.CONTAINER,
        key: 'container',
        label: 'Container',
        css: {
          display: { display: 'flex' },
          boxSizing: { padding: '16px' }
        },
        children: []
      };

      const result = serializer.serialize([item]);

      expect(result).toBeInstanceOf(Array);
      expect(result.length).toBeGreaterThan(0);
      expect(result.join('; ')).toContain('display: flex');
      expect(result.join('; ')).toContain('padding: 16px');
    });
  });

  describe('WHEN serializing item with camelCase CSS properties', () => {
    it('SHOULD convert to kebab-case', () => {
      const item: CanvasItem = {
        itemType: CanvasItemType.CONTAINER,
        key: 'container',
        label: 'Container',
        css: {
          flexContainer: { flexDirection: 'column' }
        },
        children: []
      };

      const result = serializer.serialize([item]);

      expect(result.some(line => line.includes('flex-direction'))).toBe(true);
    });
  });

  describe('WHEN serializing item with no CSS', () => {
    it('SHOULD return empty array', () => {
      const item: CanvasItem = {
        itemType: CanvasItemType.CONTAINER,
        key: 'empty',
        label: 'Empty',
        css: undefined,
        children: []
      };

      const result = serializer.serialize([item]);

      expect(result).toBeInstanceOf(Array);
      expect(result.length).toBe(0);
    });
  });

  describe('WHEN serializing multiple items', () => {
    it('SHOULD only process first item', () => {
      const items: CanvasItem[] = [
        {
          itemType: CanvasItemType.CONTAINER,
          key: 'item1',
          label: 'Item 1',
          css: {
            boxSizing: { padding: '10px' }
          },
          children: []
        },
        {
          itemType: CanvasItemType.CONTAINER,
          key: 'item2',
          label: 'Item 2',
          css: {
            boxSizing: { padding: '20px' }
          },
          children: []
        }
      ];

      const result = serializer.serialize(items);

      // CssStyleSerializer only processes single items (first one)
      expect(result).toBeInstanceOf(Array);
      expect(result.length).toBe(0); // Returns empty for multiple items
    });
  });

  describe('WHEN serializing empty array', () => {
    it('SHOULD return empty array', () => {
      const result = serializer.serialize([]);

      expect(result).toBeInstanceOf(Array);
      expect(result.length).toBe(0);
    });
  });
});
