import {Injectable} from "@angular/core";
import {Store} from "./store";
import {CanvasState} from "./canvas.store";
import {distinctUntilChanged, map} from "rxjs";

export class AppSettingsState {
  previewActive: boolean = false;
}

@Injectable({
  providedIn: 'root'
})
export class AppSettingsStore extends Store<AppSettingsState> {
  constructor() {
    super(new AppSettingsState());
  }

  get previewActive$() {
    return this.state.pipe(
      map(state => state.previewActive),
      distinctUntilChanged()
    );
  }

  get previewActive() {
    return this.getState().previewActive;
    // return this.state.pipe(
    //   map(state => state.addItemsPanelActive)
    // );
  }

  set previewActive(active: boolean) {
    this.setState({
      ...this.getState(),
      previewActive: active
    });
  }
}
