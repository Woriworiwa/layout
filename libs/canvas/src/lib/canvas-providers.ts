import { Provider } from '@angular/core';
import { CanvasStore } from './canvas.store';
import { CanvasService } from './canvas.service';
import { SelectionService } from './selection/selection.service';
import { ContextMenuService } from './context-menu/context-menu.service';
import { UndoRedoService } from './undo-redo/undo-redo.service';

/**
 * Provides all canvas-related services required for the canvas functionality.
 * Use this in your root component's providers array.
 *
 * @example
 * ```typescript
 * @Component({
 *   providers: [
 *     ...provideCanvas(),
 *     // other providers
 *   ]
 * })
 * export class AppComponent {}
 * ```
 */
export function provideCanvas(): Provider[] {
  return [
    CanvasStore,
    CanvasService,
    SelectionService,
    ContextMenuService,
    UndoRedoService,
  ];
}
