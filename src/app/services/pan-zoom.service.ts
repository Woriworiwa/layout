import {Injectable} from "@angular/core";
import {BehaviorSubject, Observable} from "rxjs";

@Injectable()
export class PanZoomService {
  private currentStateSubject: BehaviorSubject<any> = new BehaviorSubject<{panModeActive: boolean, isPanning: boolean}>({
    panModeActive: false,
    isPanning: false
  });

  state$: Observable<{ panModeActive: boolean, isPanning: boolean }> = this.currentStateSubject.asObservable();

  setPanModeActive(active: boolean) {
    this.currentStateSubject.next({
      ...this.currentStateSubject.getValue(),
      panModeActive: active
    });
  }

  setIsPanning(isPanning: boolean) {
    this.currentStateSubject.next({
      ...this.currentStateSubject.getValue(),
      isPanning: isPanning
    });
  }
}
