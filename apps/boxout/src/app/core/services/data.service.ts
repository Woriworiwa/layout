import { CanvasService, CanvasItem } from '@layout/canvas';
import { Injectable, inject } from '@angular/core';
import { mockData } from '../../../data/mock-data';

@Injectable()
export class DataService {
  private canvasService = inject(CanvasService);

  getInitialData() {
    const savedData = this.loadDataFromLocalStorage();

    if (savedData && savedData.length > 0) {
      return savedData;
    }

    return mockData as unknown as CanvasItem[];
  }

  saveDataToLocalStorage() {
    const canvasItems = this.canvasService.items;
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
