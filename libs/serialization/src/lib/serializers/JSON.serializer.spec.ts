import { describe, it, expect } from 'vitest';
import { JSONSerializer } from './JSON.serializer';
import { CanvasItem, CanvasItemType } from '@layout/models';

describe('JSONSerializer', () => {
  const serializer = new JSONSerializer();

  describe('WHEN serializing items', () => {
    it('SHOULD return empty array', () => {
      const item: CanvasItem = {
        itemType: CanvasItemType.CONTAINER,
        key: 'test-key',
        label: 'Test Container',
        css: {
          display: { display: 'flex' },
        },
        children: [],
      };

      const result = serializer.serialize([item]);

      expect(result).toBeInstanceOf(Array);
      expect(result.length).toBe(0);
    });
  });

  describe('WHEN sanitizing frames with null properties-panel', () => {
    it('SHOULD remove null and undefined properties-panel', () => {
      const frames: CanvasItem[] = [
        {
          itemType: CanvasItemType.CONTAINER,
          key: 'test',
          label: 'Test',
          content: undefined,
          css: {
            display: { display: 'flex' },
            flexboxGrid: { flexDirection: undefined as never },
          },
          children: [],
        },
      ];

      const result = serializer.sanitizeFrames(frames);

      expect(result).toBeDefined();
      expect(result?.[0]).toBeDefined();
      expect(result?.[0].content).toBeUndefined();
    });
  });

  describe('WHEN sanitizing nested frames', () => {
    it('SHOULD recursively sanitize children', () => {
      const frames: CanvasItem[] = [
        {
          itemType: CanvasItemType.CONTAINER,
          key: 'parent',
          label: 'Parent',
          css: {
            display: { display: 'flex' },
          },
          children: [
            {
              itemType: CanvasItemType.TEXT,
              key: 'child',
              label: 'Child',
              content: 'Hello',
              css: {
                spacing: { padding: '10px' },
              },
              children: [],
            },
          ],
        },
      ];

      const result = serializer.sanitizeFrames(frames);

      expect(result).toBeDefined();
      expect(result?.[0].children).toBeDefined();
      expect(result?.[0].children?.length).toBe(1);
    });
  });

  describe('WHEN sanitizing empty array', () => {
    it('SHOULD return undefined', () => {
      const result = serializer.sanitizeFrames([]);

      expect(result).toBeUndefined();
    });
  });

  describe('WHEN sanitizing null input', () => {
    it('SHOULD return undefined', () => {
      const result = serializer.sanitizeFrames(null as never);

      expect(result).toBeUndefined();
    });
  });
});
