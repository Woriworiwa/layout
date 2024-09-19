import {Injectable} from "@angular/core";
import {Store} from "./store";
import {distinctUntilChanged, map} from "rxjs";

export class AppSettingsState {
  previewActive = false;
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
  }

  set previewActive(active: boolean) {
    this.setState({
      ...this.getState(),
      previewActive: active
    });
  }
}
