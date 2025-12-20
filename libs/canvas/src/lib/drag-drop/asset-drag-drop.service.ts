import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { InsertPosition } from '../enums';

export interface AssetDragState {
  isDragging: boolean;
  presetId: string | null;
  dropTargetId: string | null;
  dropPosition: InsertPosition | null;
}

@Injectable({
  providedIn: 'root',
})
export class AssetDragDropService {
  private dragStateSubject = new BehaviorSubject<AssetDragState>({
    isDragging: false,
    presetId: null,
    dropTargetId: null,
    dropPosition: null,
  });

  dragState$ = this.dragStateSubject.asObservable();
  isDragging$ = this.dragState$.pipe(map((state) => state.isDragging));

  get currentState(): AssetDragState {
    return this.dragStateSubject.value;
  }

  startDragging(presetId: string): void {
    this.dragStateSubject.next({
      ...this.currentState,
      isDragging: true,
      presetId,
    });
  }

  endDragging(): void {
    this.dragStateSubject.next({
      isDragging: false,
      presetId: null,
      dropTargetId: null,
      dropPosition: null,
    });
  }

  setDropTarget(
    targetId: string | null,
    position: InsertPosition | null,
  ): void {
    this.dragStateSubject.next({
      ...this.currentState,
      dropTargetId: targetId,
      dropPosition: position,
    });
  }

  getDropData(): {
    presetId: string;
    targetId: string;
    position: InsertPosition;
  } | null {
    const state = this.currentState;
    if (!state.presetId || !state.dropTargetId || state.dropPosition === null) {
      return null;
    }
    return {
      presetId: state.presetId,
      targetId: state.dropTargetId,
      position: state.dropPosition,
    };
  }
}
