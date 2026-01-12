import { describe, it, expect } from 'vitest';
import { HtmlSerializer } from './html.serializer';
import { CanvasItem, CanvasItemType } from '@layout/models';

describe('HtmlSerializer', () => {
  const serializer = new HtmlSerializer();

  describe('WHEN serializing a single container', () => {
    it('SHOULD generate div element with class', () => {
      const item: CanvasItem = {
        itemType: CanvasItemType.CONTAINER,
        key: 'test-key',
        label: 'Test',
        css: {
          layout: { display: 'flex' },
        },
        children: [],
      };

      const result = serializer.serialize([item]);

      expect(result).toBeInstanceOf(Array);
      expect(result.join('\n')).toContain('<div class="test-key">');
      expect(result.join('\n')).toContain('</div>');
    });
  });

  describe('WHEN serializing nested containers', () => {
    it('SHOULD maintain parent-child hierarchy', () => {
      const parent: CanvasItem = {
        itemType: CanvasItemType.CONTAINER,
        key: 'parent-key',
        label: 'Parent',
        css: {
          layout: { display: 'flex' },
        },
        children: [
          {
            itemType: CanvasItemType.CONTAINER,
            key: 'child-key',
            label: 'Child',
            css: {
              sizing: { width: '50%' },
            },
            children: [],
          },
        ],
      };

      const result = serializer.serialize([parent]);
      const html = result.join('\n');

      expect(html).toContain('parent-key');
      expect(html).toContain('child-key');
    });
  });

  describe('WHEN serializing text items', () => {
    it('SHOULD render content inside div', () => {
      const item: CanvasItem = {
        itemType: CanvasItemType.TEXT,
        key: 'text-key',
        label: 'Text',
        content: 'Hello World',
        css: {
          spacing: { padding: '10px' },
        },
        children: [],
      };

      const result = serializer.serialize([item]);
      const html = result.join('\n');

      expect(html).toContain('Hello World');
      expect(html).toContain('text-key');
    });
  });

  describe('WHEN serializing with styles included', () => {
    it('SHOULD generate full HTML document', () => {
      const item: CanvasItem = {
        itemType: CanvasItemType.CONTAINER,
        key: 'test',
        label: 'Test',
        css: {
          layout: { display: 'grid' },
        },
        children: [],
      };

      const result = serializer.serialize([item], { includeHeaderBody: true });
      const html = result.join('\n');

      expect(html).toContain('<html>');
      expect(html).toContain('<head>');
      expect(html).toContain('<style>');
      expect(html).toContain('<body>');
      expect(html).toContain('</html>');
    });

    it('SHOULD include frame and text classes', () => {
      const item: CanvasItem = {
        itemType: CanvasItemType.CONTAINER,
        key: 'test',
        label: 'Test',
        css: {
          layout: { display: 'grid' },
        },
        children: [],
      };

      const result = serializer.serialize([item], { includeHeaderBody: true });
      const html = result.join('\n');

      expect(html).toContain('<div class="frame test">');
    });
  });

  describe('WHEN serializing empty array', () => {
    it('SHOULD return array with empty string', () => {
      const result = serializer.serialize([]);

      expect(result).toBeInstanceOf(Array);
      expect(result.join('')).toBe('');
    });
  });

  describe('WHEN serializing multiple root items', () => {
    it('SHOULD generate HTML for all items', () => {
      const items: CanvasItem[] = [
        {
          itemType: CanvasItemType.CONTAINER,
          key: 'key-1',
          label: 'Item 1',
          css: {
            layout: { display: 'flex' },
          },
          children: [],
        },
        {
          itemType: CanvasItemType.TEXT,
          key: 'key-2',
          label: 'Item 2',
          content: 'Text content',
          css: {
            spacing: { padding: '5px' },
          },
          children: [],
        },
      ];

      const result = serializer.serialize(items);
      const html = result.join('\n');

      expect(html).toContain('key-1');
      expect(html).toContain('key-2');
      expect(html).toContain('Text content');
    });
  });
});
