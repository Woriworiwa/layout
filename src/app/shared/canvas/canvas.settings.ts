export class CanvasSettings {
  showToolbar = true;
  // Add other settings with default values as needed

  constructor(init?: Partial<CanvasSettings>) {
    Object.assign(this, init);
  }
}
