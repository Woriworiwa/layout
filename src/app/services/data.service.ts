import {CanvasItem} from "../models/canvas-item.model";
import {Injectable} from "@angular/core";
import {mockData} from "../data/mock-data";
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

    return mockData as unknown as CanvasItem[];
  }

  saveDataToLocalStorage() {
    const canvasItems = this.canvasStore.canvasItems;
    localStorage.setItem('CANVAS_ITEMS', JSON.stringify(canvasItems));
  }

  clearLocalStorage() {
    localStorage.removeItem('CANVAS_ITEMS');
  }

  loadDataFromLocalStorage(): CanvasItem[] {

    let canvasItems: CanvasItem[] = [];

    try {
      const localStorageItem = localStorage.getItem('CANVAS_ITEMS');
      if (localStorageItem) {
        canvasItems = JSON.parse(localStorageItem);
      }
    } catch (e) {
      console.warn('no data available in localStorage');
    }

    return canvasItems;
  }
}
