import {Injectable} from "@angular/core";
import {BehaviorSubject, Observable} from "rxjs";
import {DragulaService} from "ng2-dragula";
import {MessageService} from "primeng/api";

@Injectable()
export class DragDropService {
  private currentStateSubject: BehaviorSubject<any> = new BehaviorSubject<{ draggingStarted: boolean, isDragging: boolean , draggingEnded: boolean}>({
    isDragging: false,
    draggingStarted: false,
    draggingEnded: false
  });

  state$: Observable<{ draggingStarted: boolean, isDragging: boolean, draggingEnded: boolean }> = this.currentStateSubject.asObservable();

  constructor(private dragulaService: DragulaService) {

    this.dragulaService.drag().subscribe(() => {
      this.currentStateSubject.next({ draggingStarted: true, isDragging: true , draggingEnded: false });
    });

    this.dragulaService.dragend().subscribe(() => {
      this.currentStateSubject.next({ draggingStarted: false, isDragging: false, draggingEnded: true });
    });
  }
}
