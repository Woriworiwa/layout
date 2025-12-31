import { Component, HostListener, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UndoRedoService } from '../undo-redo/undo-redo.service';
import { Button } from 'primeng/button';
import { PanZoomService } from '../pan-zoom/pan-zoom.service';
import { Tooltip } from 'primeng/tooltip';
import { CanvasService } from '../canvas.service';
import { Menu } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
// External services - must be provided by consuming application
// import { ThemeService } from '../../core/theme/theme.service';
// import { AppStateService } from '../../core/services/app-state.service';

@Component({
  selector: 'app-canvas-toolbar',
  imports: [CommonModule, Button, Tooltip, Menu],
  host: {
    '[class.surface-0]': 'true',
  },
  templateUrl: './canvas-toolbar.component.html',
  styleUrl: './canvas-toolbar.component.scss',
})
export class CanvasToolbarComponent {
  protected undoRedoService = inject(UndoRedoService);
  protected panZoomService = inject(PanZoomService);
  protected canvasService = inject(CanvasService);

  // TODO: Create injection tokens for external services
  // protected themeService = inject(ThemeService);
  // protected appStateService = inject(AppStateService);

  protected zoomPercentage = computed(() =>
    Math.round(this.panZoomService.scale() * 100),
  );

  protected zoomMenuItems: MenuItem[] = [
    {
      label: 'Zoom In',
      icon: 'pi pi-plus',
      command: () => this.panZoomService.zoomIn(),
    },
    {
      label: 'Zoom Out',
      icon: 'pi pi-minus',
      command: () => this.panZoomService.zoomOut(),
    },
    { separator: true },
    {
      label: 'Zoom to 100%',
      command: () => this.panZoomService.zoomTo(1),
    },
    {
      label: 'Zoom to Fit',
      command: () => this.panZoomService.zoomToFit(),
    },
    { separator: true },
    {
      label: '50%',
      command: () => this.panZoomService.zoomTo(0.5),
    },
    {
      label: '75%',
      command: () => this.panZoomService.zoomTo(0.75),
    },
    {
      label: '100%',
      command: () => this.panZoomService.zoomTo(1),
    },
    {
      label: '125%',
      command: () => this.panZoomService.zoomTo(1.25),
    },
    {
      label: '150%',
      command: () => this.panZoomService.zoomTo(1.5),
    },
    {
      label: '200%',
      command: () => this.panZoomService.zoomTo(2),
    },
  ];

  @HostListener('click', ['$event'])
  onClick($event: MouseEvent) {
    $event.stopPropagation();
  }

  toggleZoomMenu(event: Event, menu: Menu) {
    menu.toggle(event);
  }
}
