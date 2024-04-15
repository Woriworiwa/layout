import {CanvasItem} from "../../models/canvas-item.model";
import {Serializer} from "./serializer";
import {CssStyleSerializer} from "./css-style.serializer";

export class CssClassSerializer extends Serializer {
  cssStyleSerializer: Serializer = new CssStyleSerializer();

  constructor() {
    super();
  }

  serialize(items: CanvasItem[]): string[] {
    return this.serializeChildren(items);
  }

  private serializeChildren(items: CanvasItem[], level: number = 0) {
    const cssLines: string[] = [];

    items.forEach(canvasItem => {
      if (this.isAnyCssPropertySet(canvasItem)) {
        /* class name and opening curl */
        cssLines.push(this.indent(`.${canvasItem.key} {`, level));

        /* css properties */
        if (canvasItem.css) {
          this.cssStyleSerializer.serialize([canvasItem]).forEach(cssLine => {
            cssLines.push(this.indent(cssLine + ';', level + 1));
          });
        }

        /* children */
        if (canvasItem.children && canvasItem.children.length > 0) {
          cssLines.push(...this.serializeChildren(canvasItem.children, level + 1));
        }

        /* closing curl */
        cssLines.push(this.indent('}', level));
      }
    });

    return cssLines;
  }

  private isAnyCssPropertySet(canvasItem: CanvasItem) {
    if (canvasItem.css) {
      return true;
    }

    if (canvasItem.children) {
      for (const child of canvasItem.children) {
        if (this.isAnyCssPropertySet(child)) {
          return true;
        }
      }
    }

    return false;
  }
}
