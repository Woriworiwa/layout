import {Serializer} from "./serializer";
import {CanvasItem} from "../../models/canvas-item.model";
import {FrameType} from "../../models/enums";
import {CssClassSerializer} from "./css-class.serializer";
import cloneDeep from "lodash.clonedeep";
import {Css} from "../../models/css.model";

export class JSONSerializer extends Serializer {
  constructor() {
    super();
  }

  serialize(items: CanvasItem[]): string[] {
    return [];
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
}
