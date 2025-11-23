import { Injectable, inject } from "@angular/core";
import {CanvasService} from "../shared/canvas/canvas.service";
import {SelectionService} from "../shared/canvas/selection/selection.service";
import { HttpClient } from "@angular/common/http";
import { CanvasItem } from "../core/models/canvas-item.model";

@Injectable()
export class TutorialService {
  private canvasService = inject(CanvasService);
  private selectionService = inject(SelectionService);
  private httpClient = inject(HttpClient);

  cachedData: Record<string, CanvasItem[]> = {};

  constructor() {
    this.init();
  }

  init() {
    this.load('alignment');
    this.selectionService.setSelectedItemKey(this.canvasService.items[0]?.key)
  }

  load(tutorialName: string) {
    const cachedEntry = this.cachedData[tutorialName];

    if (cachedEntry) {
      this.canvasService.setItems(cachedEntry);
      this.selectionService.setSelectedItemKey(cachedEntry[0]?.key);
    } else {
      this.httpClient.get<CanvasItem[]>(`./assets/tutorial/${tutorialName}.json`).subscribe((data) => {
        this.canvasService.setItems(data);
        this.selectionService.setSelectedItemKey(data[0]?.key);
        this.cachedData[tutorialName] = data;
      });
    }
  }
}
