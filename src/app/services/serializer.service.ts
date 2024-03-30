import {Injectable} from "@angular/core";
import {CanvasStore} from "../store/canvas.store";
import {Frame} from "../models/frame.model";
import {FlexLayoutSettings} from "../models/flex-layout.model";
import cloneDeep from "lodash.clonedeep";

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
    if (!this.canvasStore.rootFrame) {
      return undefined;
    }

    return this.sanitizeFrame(cloneDeep(this.canvasStore.rootFrame));
  }

  serializeToCSS(frame: Frame) {
    const cssArray = this.generateCSSArray(frame, 0);

    return cssArray.join('\n');
  }

  private generateCSSArray(frame: Frame | undefined, level: number): string[] {
    if (!frame || !frame.flexLayoutSettings) {
      return [];
    }

    const css: string[] = [];

    if (level) {
      css.push(' ');
    }

    css.push(' '.repeat(level) + `.${frame.key} {`);

    for (const key of Object.keys(frame.flexLayoutSettings)) {
      const value = frame.flexLayoutSettings[key as keyof FlexLayoutSettings];

      // Convert camelCase to kebab-case for CSS property names
      const cssPropertyName = key.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();

      if (value) {
        css.push(' '.repeat(!level? 1 : level* 2) + `${cssPropertyName}: ${value};`);
      }
    }

    if (frame.children.length > 0) {
      frame.children.forEach(child => {
        css.push(...this.generateCSSArray(child, level + 1));
      });
    }

    css.push(' '.repeat(level) + '}');
    return css;
  }

  private sanitizeFrame(frame: Frame) {
    if (!frame) {
      return;
    }

    this.sanitizeObject(frame);
    this.sanitizeObject(frame.flexLayoutSettings);

    if (frame.children.length > 0) {
      frame.children.forEach(child => {
        this.sanitizeFrame(child);
      });
    }

    return frame;
  }

  private sanitizeObject<T>(object: T) {
    for (const prop in object) {
      if (object[prop as keyof T] === null || object[prop as keyof T] === undefined) {
        delete object[prop as keyof T];
      }
    }
  }
}
