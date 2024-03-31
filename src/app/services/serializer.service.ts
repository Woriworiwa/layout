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
    if (!this.canvasStore.frames) {
      return undefined;
    }

    return this.sanitizeFrames(cloneDeep(this.canvasStore.frames));
  }

  serializeToCSS(frames: Frame[]) {
    const cssArray = this.generateCSSArray(frames, 0);

    return cssArray.join('\n');
  }

  private generateCSSArray(frames: Frame[] | undefined, level: number): string[] {
    if (!frames || !frames.length) {
      return [];
    }

    const css: string[] = [];

    frames.forEach(frame => {
      if (!frame.flexLayoutSettings) {
        return;
      }

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

      css.push(...this.generateCSSArray(frame.children, level + 1));

      css.push(' '.repeat(level) + '}');
    });

    return css;
  }

  private sanitizeFrames(frames: Frame[]) {
    if (!frames || !frames.length) {
      return;
    }

    frames.forEach(frame => {
      this.sanitizeObject(frame);
      this.sanitizeObject(frame.flexLayoutSettings);

      this.sanitizeFrames(frame.children);
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
}
