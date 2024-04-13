import {Injectable} from "@angular/core";
import {CanvasStore} from "../store/canvas.store";
import {CanvasItem} from "../models/canvas-item.model";
import cloneDeep from "lodash.clonedeep";
import {Css} from "../models/css.model";

@Injectable({
  providedIn: 'root'
})
export class SerializerService {
  serializerActive = false;

  constructor(private canvasStore: CanvasStore) {
  }

  showSerializer() {
    this.serializerActive = true;
  }

  hideSerializer() {
    this.serializerActive = false;
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

        if (['gap', 'padding'].includes(key)) {
          cssPropertyValue += 'px';
        }

        cssProperties.push(`${cssPropertyName}: ${cssPropertyValue}`);
      }
    }

    return cssProperties;
  }

  private sanitizeFrames(frames: CanvasItem[]) {
    if (!frames || !frames.length) {
      return;
    }

    frames.forEach(frame => {
      this.sanitizeObject(frame);
      this.sanitizeObject(frame.css);

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
}
