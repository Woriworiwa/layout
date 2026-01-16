import { Serializer } from './serializer';
import { CanvasItem } from '@layout/models';
import { Css } from '@layout/models';

export class JSONSerializer extends Serializer<void> {
  constructor() {
    super();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  serialize(_items: CanvasItem[], _options?: void): string[] {
    return [];
  }

  sanitizeFrames(frames: CanvasItem[]) {
    if (!frames || !frames.length) {
      return;
    }

    frames.forEach((frame) => {
      this.sanitizeObject(frame);

      this.sanitizeObject(frame.css);

      if (frame.css) {
        for (const key of Object.keys(frame.css)) {
          if (frame.css[key as keyof Css] != null) {
            const x = frame.css[key as keyof Css];
            if (x) {
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              for (const _k of Object.keys(x)) {
                this.sanitizeObject(frame.css[key as keyof Css]);
              }
            }
          }
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
      if (
        object[prop as keyof T] === null ||
        object[prop as keyof T] === undefined
      ) {
        delete object[prop as keyof T];
      }
    }
  }
}
