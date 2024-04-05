import {Injectable} from "@angular/core";
import {Store} from "./store";
import {CanvasState} from "./canvas.store";
import {distinctUntilChanged, map} from "rxjs";

export class AppSettingsState {
  addItemsPanelActive: boolean = false;
}

@Injectable({
  providedIn: 'root'
})
export class AppSettingsStore extends Store<AppSettingsState> {
  constructor() {
    super(new AppSettingsState());
  }

  get addItemsPanelActive$() {
    return this.state.pipe(
      map(state => state.addItemsPanelActive),
      distinctUntilChanged()
    );
  }
  get addItemsPanelActive() {
    return this.getState().addItemsPanelActive;
    // return this.state.pipe(
    //   map(state => state.addItemsPanelActive)
    // );
  }

  set addItemsPanelActive(active: boolean) {
    this.setState({
      ...this.getState(),
      addItemsPanelActive: active
    });
  }
}
