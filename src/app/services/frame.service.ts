import {Injectable} from "@angular/core";
import {FrameSettings, FrameType, StackLayoutDirection} from "./frame.model";
import {BehaviorSubject, Observable} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class FrameService {
  private frameSettings: FrameSettings = {
    frameType: FrameType.STACK,
    stackLayoutSettings: {
      direction: StackLayoutDirection.HORIZONTAL
    }
  };

  private frameSettingsSujbect: BehaviorSubject<FrameSettings> = new BehaviorSubject<FrameSettings>(this.frameSettings);
  frameSettings$: Observable<FrameSettings> = this.frameSettingsSujbect.asObservable();

  constructor() {
  }

  updateFrameType(frameType: FrameType) {
    this.frameSettings.frameType = frameType;
    this.frameSettingsSujbect.next(this.frameSettings);
  }

  updateStackLayoutDirection(direction: StackLayoutDirection) {
    this.frameSettings.stackLayoutSettings.direction = direction;
    this.frameSettingsSujbect.next(this.frameSettings);
  }
}
