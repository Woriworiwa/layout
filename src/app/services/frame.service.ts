import {Injectable} from "@angular/core";
import {FrameSettings, FrameType, FlexDirection, FlexLayoutSettings} from "./frame.model";
import {BehaviorSubject, Observable} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class FrameService {
  private frameSettings: FrameSettings = {
    frameType: FrameType.FLEX,
    flexLayoutSettings: {
      flexDirection: FlexDirection.ROW,
      flexWrap: false
    }
  };

  private frameSettingsSujbect: BehaviorSubject<FrameSettings> = new BehaviorSubject<FrameSettings>(this.frameSettings);
  frameSettings$: Observable<FrameSettings> = this.frameSettingsSujbect.asObservable();

  constructor() {
  }

  updateFlexLayoutSettings(settings: FlexLayoutSettings) {
    this.frameSettings.flexLayoutSettings = settings;
    this.frameSettingsSujbect.next(this.frameSettings);
  }

  updateFrameSettings(settings: FrameSettings) {
    this.frameSettings = settings;
    this.frameSettingsSujbect.next(this.frameSettings);
  }
}
