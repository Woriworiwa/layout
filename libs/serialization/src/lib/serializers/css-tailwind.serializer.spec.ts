import { describe, it, expect, beforeEach } from 'vitest';
import { CssTailwindSerializer } from './css-tailwind.serializer';
import { CanvasItem, CanvasItemType } from '@layout/models';

describe('CssTailwindSerializer', () => {
  let serializer: CssTailwindSerializer;

  beforeEach(() => {
    serializer = new CssTailwindSerializer();
  });

  it('should create an instance', () => {
    expect(serializer).toBeDefined();
  });

  it('should return empty array when no items provided', () => {
    const result = serializer.serialize([]);
    expect(result).toEqual([]);
  });

  it('should return empty array when item has no CSS', () => {
    const item: CanvasItem = {
      itemType: CanvasItemType.CONTAINER,
      key: 'test-key',
      label: 'Test',
      content: '',
      children: [],
      editable: true,
    };
    const result = serializer.serialize([item]);
    expect(result).toEqual([]);
  });

  it('should convert display: flex to "flex" class', () => {
    const item: CanvasItem = {
      itemType: CanvasItemType.CONTAINER,
      key: 'test-key',
      label: 'Test',
      content: '',
      children: [],
      editable: true,
      css: {
        layout: {
          display: 'flex',
        },
      },
    };
    const result = serializer.serialize([item]);
    expect(result).toContain('flex');
  });

  it('should convert display: grid to "grid" class', () => {
    const item: CanvasItem = {
      itemType: CanvasItemType.CONTAINER,
      key: 'test-key',
      label: 'Test',
      content: '',
      children: [],
      editable: true,
      css: {
        layout: {
          display: 'grid',
        },
      },
    };
    const result = serializer.serialize([item]);
    expect(result).toContain('grid');
  });

  it('should convert flex-direction: row to "flex-row" class', () => {
    const item: CanvasItem = {
      itemType: CanvasItemType.CONTAINER,
      key: 'test-key',
      label: 'Test',
      content: '',
      children: [],
      editable: true,
      css: {
        flexboxGrid: {
          flexDirection: 'row',
        },
      },
    };
    const result = serializer.serialize([item]);
    expect(result).toContain('flex-row');
  });

  it('should convert justify-content: center to "justify-center" class', () => {
    const item: CanvasItem = {
      itemType: CanvasItemType.CONTAINER,
      key: 'test-key',
      label: 'Test',
      content: '',
      children: [],
      editable: true,
      css: {
        flexboxGrid: {
          justifyContent: 'center',
        },
      },
    };
    const result = serializer.serialize([item]);
    expect(result).toContain('justify-center');
  });

  it('should convert align-items: center to "items-center" class', () => {
    const item: CanvasItem = {
      itemType: CanvasItemType.CONTAINER,
      key: 'test-key',
      label: 'Test',
      content: '',
      children: [],
      editable: true,
      css: {
        flexboxGrid: {
          alignItems: 'center',
        },
      },
    };
    const result = serializer.serialize([item]);
    expect(result).toContain('items-center');
  });

  it('should convert gap with standard value to Tailwind class', () => {
    const item: CanvasItem = {
      itemType: CanvasItemType.CONTAINER,
      key: 'test-key',
      label: 'Test',
      content: '',
      children: [],
      editable: true,
      css: {
        flexboxGrid: {
          gap: '1rem',
        },
      },
    };
    const result = serializer.serialize([item]);
    // Should find gap-4 since 1rem = gap-4 in Tailwind
    expect(result).toContain('gap-4');
  });

  it('should use arbitrary values for non-standard gap', () => {
    const item: CanvasItem = {
      itemType: CanvasItemType.CONTAINER,
      key: 'test-key',
      label: 'Test',
      content: '',
      children: [],
      editable: true,
      css: {
        flexboxGrid: {
          gap: '17',
        },
      },
    };
    const result = serializer.serialize([item]);
    // Should use arbitrary value syntax
    expect(result).toContain('gap-[17px]');
  });

  it('should convert multiple CSS properties to multiple Tailwind classes', () => {
    const item: CanvasItem = {
      itemType: CanvasItemType.CONTAINER,
      key: 'test-key',
      label: 'Test',
      content: '',
      children: [],
      editable: true,
      css: {
        layout: {
          display: 'flex',
        },
        flexboxGrid: {
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'row',
        },
      },
    };
    const result = serializer.serialize([item]);
    expect(result).toContain('flex');
    expect(result).toContain('flex-row');
    expect(result).toContain('justify-center');
    expect(result).toContain('items-center');
  });

  it('should use arbitrary values for custom padding', () => {
    const item: CanvasItem = {
      itemType: CanvasItemType.CONTAINER,
      key: 'test-key',
      label: 'Test',
      content: '',
      children: [],
      editable: true,
      css: {
        spacing: {
          padding: '17px',
        },
      },
    };
    const result = serializer.serialize([item]);
    expect(result).toContain('p-[17px]');
  });

  it('should convert standard padding values to Tailwind classes', () => {
    const item: CanvasItem = {
      itemType: CanvasItemType.CONTAINER,
      key: 'test-key',
      label: 'Test',
      content: '',
      children: [],
      editable: true,
      css: {
        spacing: {
          padding: '1rem',
        },
      },
    };
    const result = serializer.serialize([item]);
    // Should find p-4 since 1rem = p-4 in Tailwind
    expect(result).toContain('p-4');
  });

  it('should handle numeric gap values', () => {
    const item: CanvasItem = {
      itemType: CanvasItemType.CONTAINER,
      key: 'test-key',
      label: 'Test',
      content: '',
      children: [],
      editable: true,
      css: {
        layout: {
          display: 'flex',
        },
        flexboxGrid: {
          gap: "10", // Numeric value instead of string
          flexDirection: 'column',
        },
      },
    };
    const result = serializer.serialize([item]);
    expect(result).toContain('flex');
    expect(result).toContain('flex-col');
    expect(result).toContain('gap-[10px]'); // Should convert number to string and add px
  });
});
