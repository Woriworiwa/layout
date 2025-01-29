import {Injectable} from "@angular/core";
import {CanvasService} from "../shared/canvas/canvas.service";
import {PresetsService} from "../designer/insert/presets.service";
import {SelectionService} from "../shared/canvas/selection/selection.service";

@Injectable()
export class TutorialService {
  constructor(private canvasService: CanvasService,
              private presetsService: PresetsService,
              private selectionService: SelectionService) {
    this.init();
  }

  init() {
    this.canvasService.setItems([this.presetsService.getPresets()[4].presetDefinition])
    this.selectionService.setSelectedItemKey(this.canvasService.items[0]?.key)
  }

}
