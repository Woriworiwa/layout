import {Injectable} from "@angular/core";
import {CanvasStore} from "../store/canvas.store";
import {CanvasItem} from "../models/canvas-item.model";
import cloneDeep from "lodash.clonedeep";
import {Css, POSTFIX_UNIT, POSTFIXED_PROPERTIES} from "../models/css.model";
import {FrameType} from "../models/enums";

@Injectable({
  providedIn: 'root'
})
export class SerializerService {
  constructor(private canvasStore: CanvasStore) {
  }

  serializeToJSON() {
    if (!this.canvasStore.frames) {
      return undefined;
    }

    return this.sanitizeFrames(cloneDeep(this.canvasStore.frames));
  }

  serializeToCssClasses(canvasItems: CanvasItem[], level: number = 0) {
    const padding = 4;
    const cssLines: string[] = [];

    canvasItems.forEach(canvasItem => {
      if (this.isAnyCssPropertySet(canvasItem)) {
        /* class name and opening curl */
        cssLines.push(' '.repeat(level * padding) + `.${canvasItem.key} {`);

        /* css properties */
        if (canvasItem.css) {
          this.serializeToCssStyles(canvasItem.css).forEach(cssLine => {
            const propertyPading = ' '.repeat((!level ? 1 : level * 2) * padding)
            cssLines.push(propertyPading + cssLine + ';');
          });
        }

        /* children */
        if (canvasItem.children && canvasItem.children.length > 0) {
          cssLines.push(...this.serializeToCssClasses(canvasItem.children, level + 1));
        }

        /* closing curl */
        cssLines.push(' '.repeat(level * padding) + '}');
      }
    });

    return cssLines;
  }

  serializeToCssStyles(css: Css) {
    const cssProperties: string[] = [];

    /* loop through the root keys (boxSizing, flex,...) */
    for (const key of Object.keys(css)) {
      const value = css[key as keyof Css];

      if (value == null) {
        continue;
      }

      /* loop through the subkeys of the root keys */
      for (const key of Object.keys(value)) {

        // Convert camelCase to kebab-case for CSS property names
        const cssPropertyName = key.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
        let cssPropertyValue: string = value[key as keyof Css[keyof Css]];

        if (cssPropertyValue == null) {
          continue;
        }

        if (POSTFIXED_PROPERTIES.includes(key)) {
          cssPropertyValue += POSTFIX_UNIT;
        }

        cssProperties.push(`${cssPropertyName}: ${cssPropertyValue}`);
      }
    }

    return cssProperties;
  }

  serializeToHtml(canvasItems: CanvasItem[], level: number = 0) {
    const padding = 2;
    const htmlLines: string[] = [];
    htmlLines.push(`<html>`);

    /* head */
    htmlLines.push(`${' '.repeat(padding)}<head>`);

    /* frame styles*/
    htmlLines.push(`${' '.repeat(padding * 2)}<style>`);
    htmlLines.push(`${' '.repeat(padding * 2)}.frame {
      display: block;
      padding: 15px;
      background-color: #9161a7;
      border: 1px solid #ed9534;
    }`);

    /* text styles */
    htmlLines.push(`${' '.repeat(padding * 2)}.text {
      display: block;
      padding: 5px;
      background-color: #ed9534;
      border-radius: 6px;
      border: 2px solid black;
      box-shadow: inset 3px 3px 7px 5px #f2ad62;
    }`);

    htmlLines.push(`${' '.repeat(padding * 2)}</style>`);

    htmlLines.push(`${' '.repeat(padding * 2)}<style>`);
    htmlLines.push(this.serializeToCssClasses(canvasItems, 2).join('\n'));
    htmlLines.push(`${' '.repeat(padding * 2)}</style>`);
    htmlLines.push(`${' '.repeat(padding)}</head>`);

    /* body */
    htmlLines.push(`${' '.repeat(padding)}<body>`);
    htmlLines.push(this.serializeToHtmlChildren(canvasItems, 2).join('\n'));
    htmlLines.push(`${' '.repeat(padding)}</body>`);

    htmlLines.push(`</html>`);
    return htmlLines;
  }

  private sanitizeFrames(frames: CanvasItem[]) {
    if (!frames || !frames.length) {
      return;
    }

    frames.forEach(frame => {
      this.sanitizeObject(frame);

      this.sanitizeObject(frame.css);

      if (frame.css) {
        for (const key of Object.keys(frame.css)) {
          this.sanitizeObject(frame.css[key as keyof Css]);
        }
      }

      if (frame.children) {
        this.sanitizeFrames(frame.children);
      }
    });

    return frames;
  }

  private sanitizeObject<T>(object: T) {
    for (const prop in object) {
      if (object[prop as keyof T] === null || object[prop as keyof T] === undefined) {
        delete object[prop as keyof T];
      }
    }
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

  private serializeToHtmlChildren(canvasItems: CanvasItem[], level: number = 0) {
    const padding = 2;
    const htmlLines: string[] = [];

    canvasItems.forEach(canvasItem => {
      /* class name and opening curl */
      const cssClasses = `${canvasItem.frameType === FrameType.FLEX ? 'frame' : 'text'} ${canvasItem.key}`;
      const linePadding = ' '.repeat(level * padding);
      htmlLines.push(`${linePadding}<div class="${cssClasses}">`);

      if (canvasItem.frameType === FrameType.TEXT) {
        htmlLines.push(canvasItem.name!)
      }
      /* children */
      if (canvasItem.children && canvasItem.children.length > 0) {
        htmlLines.push(...this.serializeToHtmlChildren(canvasItem.children, level + 1));
      }

      /* closing curl */
      htmlLines.push(' '.repeat(level * padding) + `</div>`);
    });

    return htmlLines;
  }
}
