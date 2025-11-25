import {Injectable} from "@angular/core";
import {BehaviorSubject, Observable, Subject} from "rxjs";
import {Options} from 'sortablejs';

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

  private dropSubject: Subject<{item: string, from: string, to: string, oldIndex: number, newIndex: number}> = new Subject();
  drop$ = this.dropSubject.asObservable();

  startDragging() {
    console.log('start dragging')
    this.currentStateSubject.next({
      ...this.currentStateSubject.getValue(),
      isDragging: true
    });
  }

  endDragging() {
    console.log('end dragging')
    this.currentStateSubject.next({
      ...this.currentStateSubject.getValue(),
      isDragging: false
    });
  }

  createGroup(options: Options = {}) {
    return {
      swapThreshold: 0.5,
      ghostClass: 'drag-background-lvl-1',
      fallbackOnBody: true,
      onUpdate: (event) => {
        console.log('--update')
        // this.canvasService.setItems([...this.canvasService.items]), // .moveItemChild(event.from.id || event.to.id, event.to.id, event.oldIndex!, event.newIndex!),
        const {item, from, to, oldIndex, newIndex} = event;
        this.dropSubject.next({item: item.id, from: from.id, to: to.id, newIndex: newIndex!, oldIndex: oldIndex!});
      },
      onStart: (_) => this.startDragging(),
      onEnd: (_) => this.endDragging(),
      ...options
    } as Options;

  }
}
