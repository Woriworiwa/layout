import { Injectable, OnDestroy, inject } from '@angular/core';
import {
  BehaviorSubject,
  debounceTime,
  Observable,
  Subject,
  takeUntil,
} from 'rxjs';
import { CanvasStore } from '../../canvas/canvas.store';
import cloneDeep from 'lodash.clonedeep';
import { CanvasItem } from '../../core/models/canvas-item.model'

/*
 *  A simple undo/redo service that can be used to store and retrieve the current state of the store
 *  this is far from suitable for production use, but it's a good starting point for a simple implementation
 * */
@Injectable()
export class UndoRedoService implements OnDestroy {
  private canvasStore = inject(CanvasStore);

  private undoStack: any[][] = [];
  private redoStack: any[][] = [];
  private undoRedoExecutedSubject: Subject<any[]> = new Subject<any[]>();
  private statusSubject: BehaviorSubject<any> = new BehaviorSubject({
    undoStackEmpty: true,
    redoStackEmpty: true,
  });
  private undoStackSubject: Subject<CanvasItem[]> = new Subject<CanvasItem[]>();
  private destroy$ = new Subject<boolean>();

  status$ = this.statusSubject.asObservable();
  undoRedoExecuted$: Observable<any[]> =
    this.undoRedoExecutedSubject.asObservable();

  constructor() {
    this.undoStackSubject
      .pipe(debounceTime(250), takeUntil(this.destroy$))
      .subscribe((data) => {
        this.undoStack.push(data);
        this.updateState();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  takeSnapshot() {
    this.undoStackSubject.next(cloneDeep(this.canvasStore.items));
  }

  undo() {
    if (!this.undoStack.length) {
      return;
    }

    const item = this.undoStack.pop();
    if (!item) {
      return;
    }

    this.redoStack.push(cloneDeep(item));
    this.undoRedoExecutedSubject.next(
      cloneDeep(this.undoStack[this.undoStack.length - 1]),
    );
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
    this.undoRedoExecutedSubject.next(cloneDeep(item));
    this.updateState();
  }

  private updateState() {
    this.statusSubject.next({
      undoStackEmpty: this.undoStack.length <= 1,
      redoStackEmpty: this.redoStack.length === 0,
    });
  }
}
