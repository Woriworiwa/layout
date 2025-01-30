import {Injectable} from "@angular/core";
import {CanvasService} from "../shared/canvas/canvas.service";
import {PresetsService} from "../design/insert/presets.service";
import {SelectionService} from "../shared/canvas/selection/selection.service";
import { HttpClient } from "@angular/common/http";
import { CanvasItem } from "../core/models/canvas-item.model";

@Injectable()
export class TutorialService {
  constructor(private canvasService: CanvasService,
              private selectionService: SelectionService,
              private httpClient: HttpClient) {
    this.init();
  }

  init() {
    this.load();
    this.selectionService.setSelectedItemKey(this.canvasService.items[0]?.key)
  }

  load() {
    this.httpClient.get<CanvasItem[]>('./assets/tutorial/justify-content.json').subscribe((data) => {
      this.canvasService.setItems(data);
      this.selectionService.setSelectedItemKey(data[0]?.key);
    });
  }
}
