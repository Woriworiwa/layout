import {Serializer} from "./serializer";
import {CanvasItem} from "../../models/canvas-item.model";
import {FrameType} from "../../models/enums";
import {CssClassSerializer} from "./css-class.serializer";

export class HtmlSerializer extends Serializer {
  private readonly frameStyles = `.frame {
      display: block;
      padding: 15px;
      background-color: #9161a7;
      border: 1px solid #ed9534;
    }`;

  private readonly textStyles = `.text {
      display: block;
      padding: 5px;
      background-color: #ed9534;
      border-radius: 6px;
      border: 2px solid black;
      box-shadow: inset 3px 3px 7px 5px #f2ad62;
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

  private serializeChildren(canvasItems: CanvasItem[], level: number = 0) {
    const htmlLines: string[] = [];

    canvasItems.forEach(canvasItem => {
      /* class name and opening curl */
      const cssClasses = `${canvasItem.frameType === FrameType.FLEX ? 'frame' : 'text'} ${canvasItem.key}`;
      htmlLines.push(this.indent(`<div class="${cssClasses}">`, level * 2));

      if (canvasItem.frameType === FrameType.TEXT) {
        htmlLines.push(canvasItem.name!)
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
