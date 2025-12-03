import {Serializer} from "./serializer";
import {CanvasItem} from "../../models/canvas-item.model";
import {CanvasItemType} from "../../enums";
import {CssClassSerializer} from "./css-class.serializer";

export class HtmlSerializer extends Serializer {
  private readonly frameStyles = `.frame {
      display: block;
      padding: 20px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border: 2px solid rgba(255, 255, 255, 0.2);
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08);
      transition: transform 0.2s ease;
    }`;

  private readonly textStyles = `.text {
      display: block;
      padding: 12px 16px;
      background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
      border-radius: 8px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      color: white;
      font-size: 14px;
      font-weight: 500;
      line-height: 1.5;
    }`;

  private cssClassSerializer: CssClassSerializer = new CssClassSerializer();

  constructor() {
    super();
  }

  serialize(items: CanvasItem[]): string[] {
    const htmlLines: string[] = [];

    /* html */
    htmlLines.push(`<html>`);

    /* head */
    htmlLines.push(this.indent(`<head>`));

    /* frame and text styles*/
    htmlLines.push(this.indent('<style>', 2));
    htmlLines.push(this.indent(this.frameStyles, 2));
    htmlLines.push(this.indent(this.textStyles, 2));
    htmlLines.push(this.indent(`</style>`, 2));

    /* item classes */
    htmlLines.push(this.indent('<style>', 2));
    htmlLines.push(this.cssClassSerializer.serialize(items).map(item => this.indent(item, 2)).join('\n'));
    htmlLines.push(this.indent(`</style>`, 2))

    htmlLines.push(this.indent(`</head>`));

    /* body */
    htmlLines.push(this.indent('<body>'));
    htmlLines.push(this.serializeChildren(items, 2).join('\n'));
    htmlLines.push(this.indent('</body>'));

    /* close html */
    htmlLines.push(`</html>`);

    return htmlLines;
  }

  private serializeChildren(canvasItems: CanvasItem[], level = 0) {
    const htmlLines: string[] = [];

    canvasItems.forEach(canvasItem => {
      /* class name and opening curl */
      const cssClasses = `${canvasItem.itemType === CanvasItemType.FLEX ? 'frame' : 'text'} ${canvasItem.key}`;
      htmlLines.push(this.indent(`<div class="${cssClasses}">`, level * 2));

      if (canvasItem.itemType === CanvasItemType.TEXT && canvasItem.content) {
        htmlLines.push(canvasItem.content)
      }

      /* children */
      if (canvasItem.children && canvasItem.children.length > 0) {
        htmlLines.push(...this.serializeChildren(canvasItem.children, level + 1));
      }

      /* closing curl */
      htmlLines.push(this.indent(`</div>`, level * 2));
    });

    return htmlLines;
  }
}
