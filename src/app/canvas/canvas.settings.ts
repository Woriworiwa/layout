export class CanvasSettings {
  showToolbar = true;
  allowAdd = false;
  allowDragDrop = false;

  constructor(init?: Partial<CanvasSettings>) {
    Object.assign(this, init);
  }
}
