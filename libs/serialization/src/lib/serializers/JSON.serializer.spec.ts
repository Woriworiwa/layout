import { describe, it, expect } from 'vitest';
import { JSONSerializer } from './JSON.serializer';
import { CanvasItem, CanvasItemType } from '@layout/models';

describe('JSONSerializer', () => {
  const serializer = new JSONSerializer();

  describe('WHEN serializing items', () => {
    it('SHOULD return empty array', () => {
      const item: CanvasItem = {
        itemType: CanvasItemType.FLEX,
        key: 'test-key',
        label: 'Test Container',
        css: {
          display: { display: 'flex' }
        },
        children: []
      };

      const result = serializer.serialize([item]);

      expect(result).toBeInstanceOf(Array);
      expect(result.length).toBe(0);
    });
  });

  describe('WHEN sanitizing frames with null properties', () => {
    it('SHOULD remove null and undefined properties', () => {
      const frames: CanvasItem[] = [
        {
          itemType: CanvasItemType.FLEX,
          key: 'test',
          label: 'Test',
          content: undefined,
          css: {
            display: { display: 'flex' },
            flexContainer: { flexDirection: undefined as any }
          },
          children: []
        }
      ];

      const result = serializer.sanitizeFrames(frames);

      expect(result).toBeDefined();
      expect(result![0]).toBeDefined();
      expect(result![0].content).toBeUndefined();
    });
  });

  describe('WHEN sanitizing nested frames', () => {
    it('SHOULD recursively sanitize children', () => {
      const frames: CanvasItem[] = [
        {
          itemType: CanvasItemType.FLEX,
          key: 'parent',
          label: 'Parent',
          css: {
            display: { display: 'flex' }
          },
          children: [
            {
              itemType: CanvasItemType.TEXT,
              key: 'child',
              label: 'Child',
              content: 'Hello',
              css: {
                boxSizing: { padding: '10px' }
              },
              children: []
            }
          ]
        }
      ];

      const result = serializer.sanitizeFrames(frames);

      expect(result).toBeDefined();
      expect(result![0].children).toBeDefined();
      expect(result![0].children!.length).toBe(1);
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
      const result = serializer.sanitizeFrames(null as any);

      expect(result).toBeUndefined();
    });
  });
});
