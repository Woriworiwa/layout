import { CanvasItem } from '@layout/models';
import { Serializer } from './serializer';
import { CssStyleSerializer } from './css-style.serializer';

export class CssClassSerializer extends Serializer<void> {
  cssStyleSerializer: Serializer<void> = new CssStyleSerializer();

  constructor() {
    super();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  serialize(items: CanvasItem[], _options?: void): string[] {
    return this.serializeItems(items);
  }

  private serializeItems(items: CanvasItem[]): string[] {
    const cssLines: string[] = [];

    items.forEach((canvasItem) => {
      this.serializeItem(canvasItem, cssLines);
    });

    return cssLines;
  }

  private serializeItem(
    canvasItem: CanvasItem,
    cssLines: string[],
  ) {
    // Generate CSS class for this item if it has CSS properties
    if (canvasItem.css) {
      cssLines.push('');
      cssLines.push(`.${canvasItem.key} {`);

      this.cssStyleSerializer.serialize([canvasItem]).forEach((cssLine) => {
        cssLines.push(this.indent(cssLine + ';', 1));
      });

      cssLines.push('}');
    }

    // Process children recursively (all classes at root level)
    if (canvasItem.children && canvasItem.children.length > 0) {
      canvasItem.children.forEach((child) => {
        this.serializeItem(child, cssLines);
      });
    }
  }
}
