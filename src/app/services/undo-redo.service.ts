import {Injectable} from "@angular/core";
import {BehaviorSubject, Observable, Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UndoRedoService {
  private undoStack: any[][] = [];
  private redoStack: any[][] = [];

  private currentDataSubject: Subject<any[]> = new Subject<any[]>();
  data$: Observable<any[]> = this.currentDataSubject.asObservable();

  private currentStateSubject: BehaviorSubject<any> = new BehaviorSubject({
    undoStackEmpty: true,
    redoStackEmpty: true
  });

  state$ = this.currentStateSubject.asObservable();

  pushUndoStack(item: any[]) {
    this.undoStack.push(item);
    this.updateState();
  }

  undo() {
    if (!this.undoStack.length) {
      return;
    }

    const item = this.undoStack.pop();
    if (!item) {
      return;
    }

    this.redoStack.push(item);
    this.currentDataSubject.next(this.undoStack[this.undoStack.length - 1])
    this.updateState();
  }

  redo() {
    if (this.redoStack.length === 0) {
      return;
    }

    const item = this.redoStack.pop();
    if (!item) {
      return;
    }

    this.undoStack.push(item);
    this.currentDataSubject.next(item);
    this.updateState();
  }

  private updateState() {
    this.currentStateSubject.next({
      undoStackEmpty: this.undoStack.length <= 1,
      redoStackEmpty: this.redoStack.length === 0
    });
  }
}
