import {CdkDragMove, CdkDragRelease, CdkDropList} from "@angular/cdk/drag-drop";
import {Inject, Injectable} from "@angular/core";
import {DOCUMENT} from "@angular/common";

@Injectable({providedIn: 'root'})
export class DragDropService {
  dropLists: CdkDropList[] = [];
  currentHoverDropListId?: string;

  constructor(@Inject(DOCUMENT) private document: Document) {}

  public register(dropList: CdkDropList) {
    this.dropLists.push(dropList);
  }

  get dropListIds() {
    return this.dropLists.map(dropList => dropList.id);
  }
  dragMoved(event: CdkDragMove<undefined>) {
    let elementFromPoint = this.document.elementFromPoint(
      event.pointerPosition.x,
      event.pointerPosition.y
    );

    if (!elementFromPoint) {
      this.currentHoverDropListId = undefined;
      return;
    }

    let dropList = elementFromPoint.classList.contains('cdk-drop-list')
      ? elementFromPoint
      : elementFromPoint.closest('.cdk-drop-list');

    if (!dropList) {
      this.currentHoverDropListId = undefined;
      return;
    }

    console.log(dropList.id);
    this.currentHoverDropListId = dropList.id;
  }

  dragReleased(event: CdkDragRelease) {
    this.currentHoverDropListId = undefined;
  }
}
