import {Frame} from "../models/frame.model";
import {Injectable} from "@angular/core";
import {mockData} from "../store/mock-data";

@Injectable()
export class DataService {
  getInitialData() {
    const frames: Frame = mockData as Frame;
    this.assingKeys([frames], undefined)

    return frames;
  }

  private assingKeys(frames: Frame[], parentKey: string | undefined) {
    frames.forEach((frame, index) => {
      if (frame.key == null) {
        frame.key = parentKey == null ? `0` : `${parentKey}-${index}`;
      }

      if (frame.children.length > 0) {
        this.assingKeys(frame.children, frame.key);
      }
    });

  }
}
