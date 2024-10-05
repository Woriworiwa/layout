import {Injectable} from "@angular/core";
import {BehaviorSubject, distinctUntilChanged, map, Observable, Subject} from "rxjs";
import {Options} from 'sortablejs'
import {CanvasStore} from "../store/canvas.store";

@Injectable()
export class DragDropService {
  private currentStateSubject: BehaviorSubject<any> = new BehaviorSubject<{
    draggingStarted: boolean,
    isDragging: boolean,
    draggingEnded: boolean
  }>({
    isDragging: false,
    draggingStarted: false,
    draggingEnded: false
  });

  state$: Observable<{
    draggingStarted: boolean,
    isDragging: boolean,
    draggingEnded: boolean
  }> = this.currentStateSubject.asObservable();

  private dropSubject = new Subject();
  drop$ = this.dropSubject.asObservable();

  constructor(private canvasService: CanvasStore) {

  }

  startDragging() {
    this.currentStateSubject.next({
      ...this.currentStateSubject.getValue(),
      isDragging: true
    });
  }

  endDragging() {
    this.currentStateSubject.next({
      ...this.currentStateSubject.getValue(),
      isDragging: false
    });
  }

  createGroup(options: Options = {}) {
    return {
      swapThreshold: 0.5,
      ghostClass: 'blue-background-class',
      fallbackOnBody: true,
      onUpdate: (event) => this.dropSubject.next(undefined), // this.canvasService.setItems([...this.canvasService.items]), // .moveItemChild(event.from.id || event.to.id, event.to.id, event.oldIndex!, event.newIndex!),
      onStart: (event) => this.startDragging(),
      onEnd: (event) => this.endDragging(),
      ...options
    } as Options;

  }
}
