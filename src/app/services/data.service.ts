import {CanvasItem} from "../models/canvas-item.model";
import {Injectable} from "@angular/core";
import {mockData} from "../data/mock-data";
import {flexPresets, textPresets} from "../data/presets";
import {Preset} from "../models/preset.model";
import {CanvasStore} from "../store/canvas.store";

@Injectable()
export class DataService {
  constructor(private canvasStore: CanvasStore) {
  }

  getInitialData() {
    const savedData = this.loadDataFromLocalStorage();

    if (savedData && savedData.length > 0) {
      return savedData;
    }

    const frames: CanvasItem[] = mockData as CanvasItem[];
    return frames;
  }

  saveDataToLocalStorage() {
    const canvasItems = this.canvasStore.frames;
    localStorage.setItem('CANVAS_ITEMS', JSON.stringify(canvasItems));
  }

  loadDataFromLocalStorage(): CanvasItem[] {

    let canvasItems: CanvasItem[] = [];

    try {
      canvasItems = JSON.parse(localStorage.getItem('CANVAS_ITEMS')!);
    } catch (e) {
      console.warn('no data available in localStorage');
    }

    return canvasItems;
  }
}
