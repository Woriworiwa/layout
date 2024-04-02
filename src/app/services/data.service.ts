import {Frame} from "../models/frame.model";
import {Injectable} from "@angular/core";
import {mockData} from "../store/mock-data";

@Injectable()
export class DataService {
  getInitialData() {
    const frames: Frame[] = mockData as Frame[];
    return frames;
  }
}
