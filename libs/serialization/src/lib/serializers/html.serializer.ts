import { Serializer } from './serializer';
import { CanvasItem, CanvasItemType } from '@layout/models';
import { CssClassSerializer } from './css-class.serializer';
import { CssTailwindSerializer } from './css-tailwind.serializer';
import { CssStyleSerializer } from './css-style.serializer';
import type { CssSerializerType } from '../types';

export interface HtmlSerializerOptions {
  includeHeaderBody?: boolean;
  cssSerializerType?: CssSerializerType;
}

export class HtmlSerializer extends Serializer<HtmlSerializerOptions> {
  // Reusable serializer instances (performance optimization)
  private readonly cssClassSerializer = new CssClassSerializer();
  private readonly cssStyleSerializer = new CssStyleSerializer();
  private readonly cssTailwindSerializer = new CssTailwindSerializer();

  constructor() {
    super();
  }

  serialize(items: CanvasItem[], options?: HtmlSerializerOptions): string[] {
    const includeHeaderBody = options?.includeHeaderBody ?? false;
    const cssSerializerType = options?.cssSerializerType ?? 'CSS-class';

    return includeHeaderBody
      ? this.serializeFullDocument(items, cssSerializerType)
      : this.serializeFragment(items, cssSerializerType);
  }

  private serializeFragment(items: CanvasItem[], cssSerializerType: CssSerializerType): string[] {
    const htmlLines: string[] = [];

    // Include <style> if using CSS-class mode and there are items
    if (cssSerializerType === 'CSS-class' && items.length > 0) {
      htmlLines.push(...this.generateStyleBlock(items, 0, cssSerializerType));
    }

    const bodyContent = this.serializeChildren(items, cssSerializerType, 0, false);
    htmlLines.push(...bodyContent);

    return htmlLines;
  }

  private serializeFullDocument(items: CanvasItem[], cssSerializerType: CssSerializerType): string[] {
    const htmlLines: string[] = [];

    htmlLines.push('<html>');
    htmlLines.push(this.indent('<head>'));

    // Add CSS class definitions
    htmlLines.push(...this.generateStyleBlock(items, 2, cssSerializerType));

    htmlLines.push(this.indent('</head>'));

    // Body
    htmlLines.push(this.indent('<body>'));
    const bodyContent = this.serializeChildren(items, cssSerializerType, 2, true);
    htmlLines.push(...bodyContent);
    htmlLines.push(this.indent('</body>'));

    htmlLines.push('</html>');

    return htmlLines;
  }

  private generateStyleBlock(
    items: CanvasItem[],
    indentLevel: number,
    cssSerializerType: CssSerializerType
  ): string[] {
    const lines: string[] = [];

    // Only generate style block if there are CSS classes to include
    if (cssSerializerType === 'CSS-class') {
      const cssClasses = this.cssClassSerializer.serialize(items);
      if (cssClasses.length > 0) {
        lines.push(this.indent('<style>', indentLevel));
        cssClasses.forEach((cssLine) => {
          lines.push(this.indent(cssLine, indentLevel));
        });
        lines.push(this.indent('</style>', indentLevel));
      }
    }

    return lines;
  }

  private serializeChildren(
    canvasItems: CanvasItem[],
    cssSerializerType: CssSerializerType,
    level: number,
    includeBaseClasses: boolean,
  ): string[] {
    const htmlLines: string[] = [];

    canvasItems.forEach((canvasItem) => {
      const { classAttribute, styleAttribute } = this.generateAttributes(
        canvasItem,
        cssSerializerType,
        includeBaseClasses,
      );

      // Opening div tag
      const openingTag = this.buildOpeningTag(classAttribute, styleAttribute);
      htmlLines.push(this.indent(openingTag, level * 2));

      // Text content
      if (canvasItem.itemType === CanvasItemType.TEXT && canvasItem.content) {
        htmlLines.push(this.indent(canvasItem.content, level * 2 + 1));
      }

      // Children
      if (canvasItem.children && canvasItem.children.length > 0) {
        htmlLines.push(
          ...this.serializeChildren(
            canvasItem.children,
            cssSerializerType,
            level + 1,
            includeBaseClasses,
          ),
        );
      }

      // Closing div tag
      htmlLines.push(this.indent('</div>', level * 2));
    });

    return htmlLines;
  }

  private buildOpeningTag(classAttribute: string, styleAttribute: string | null): string {
    let tag = '<div';
    if (classAttribute) {
      tag += ` class="${classAttribute}"`;
    }
    if (styleAttribute) {
      tag += ` style="${styleAttribute}"`;
    }
    tag += '>';
    return tag;
  }

  private generateAttributes(
    canvasItem: CanvasItem,
    cssSerializerType: CssSerializerType,
    includeBaseClasses: boolean,
  ): { classAttribute: string; styleAttribute: string | null } {
    const baseClass = includeBaseClasses
      ? (canvasItem.itemType === CanvasItemType.CONTAINER ? 'frame' : 'text')
      : '';
    const existingTailwindClasses = canvasItem.tailwindClasses || '';
    let styleAttribute: string | null = null;

    const classAttribute = this.buildClassAttribute(
      baseClass,
      canvasItem,
      cssSerializerType,
      existingTailwindClasses,
    );

    // Generate inline style for CSS-style mode
    if (cssSerializerType === 'CSS-style') {
      const cssProperties = this.cssStyleSerializer.serialize([canvasItem]);
      if (cssProperties.length > 0) {
        styleAttribute = cssProperties.join('; ');
      }
    }

    return { classAttribute, styleAttribute };
  }

  private buildClassAttribute(
    baseClass: string,
    canvasItem: CanvasItem,
    cssSerializerType: CssSerializerType,
    existingTailwindClasses: string,
  ): string {
    const classes: string[] = [];

    // Only add base class if provided
    if (baseClass) {
      classes.push(baseClass);
    }

    switch (cssSerializerType) {
      case 'CSS-class':
        if (canvasItem.key) {
          classes.push(canvasItem.key);
        }
        break;

      case 'CSS-Tailwind': {
        const tailwindClasses = this.cssTailwindSerializer.serialize([canvasItem]);
        if (tailwindClasses.length > 0) {
          classes.push(...tailwindClasses);
        }
        break;
      }
    }

    if (existingTailwindClasses) {
      classes.push(...existingTailwindClasses.split(' '));
    }

    return classes.join(' ').trim();
  }
}
