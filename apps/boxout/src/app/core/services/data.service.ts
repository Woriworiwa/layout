import { CanvasItem } from '@layout/models';
import { Injectable, inject } from '@angular/core';
import { CanvasService } from '@layout/canvas';
import { LocalStorageService } from './local-storage.service';

@Injectable()
export class DataService {
  private canvasService = inject(CanvasService);
  private localStorageService = inject(LocalStorageService);

  private readonly CANVAS_ITEMS_KEY = 'CANVAS_ITEMS';

  getInitialData(): CanvasItem[] {
    const savedData = this.loadDataFromLocalStorage();

    if (savedData && savedData.length > 0) {
      return savedData;
    }

    return [];
  }

  saveDataToLocalStorage() {
    const canvasItems = this.canvasService.items;
    this.localStorageService.setItem(this.CANVAS_ITEMS_KEY, canvasItems);
  }

  clearLocalStorage() {
    this.localStorageService.removeItem(this.CANVAS_ITEMS_KEY);
  }

  loadDataFromLocalStorage(): CanvasItem[] {
    return this.localStorageService.getItem<CanvasItem[]>(this.CANVAS_ITEMS_KEY, []) || [];
  }
}
