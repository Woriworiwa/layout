import { Component, OnDestroy, OnInit, ViewChild, inject, AfterViewInit } from '@angular/core';

import { MenuItem } from "primeng/api";
import { CanvasItem } from "../../core/models/canvas-item.model";
import { FormsModule } from "@angular/forms";
import { ContextMenu } from "primeng/contextmenu";
import { Popover } from "primeng/popover";
import { Button } from "primeng/button";
import { InputText } from "primeng/inputtext";
import { CanvasService } from "../../canvas/canvas.service";
import { SelectionService } from "../../canvas/selection/selection.service";
import { Subject, takeUntil } from "rxjs";
import { CustomTreeComponent } from "./custom-tree/custom-tree.component";

@Component({
    selector: 'app-layers',
    imports: [FormsModule, ContextMenu, Popover, Button, InputText, CustomTreeComponent],
    templateUrl: './layers.component.html',
    styleUrls: ['./layers.component.scss']
})
export class LayersComponent implements OnInit, OnDestroy {
  private canvasService = inject(CanvasService);
  private selectionService = inject(SelectionService);

  @ViewChild(Popover) renameDialog!: Popover;
  @ViewChild(ContextMenu) contextMenu!: ContextMenu;

  items: CanvasItem[] = [];
  selectedItem: CanvasItem | undefined = undefined;
  selectedItemKey: string | undefined = undefined;

  private destroy$ = new Subject<boolean>();

  contextMenuItems: MenuItem[] = [
    { label: 'Rename', icon: 'pi pi-pencil', command: () => this.openRenameDialog() },
  ];

  ngOnInit() {
    this.initStoreSubscriptions();
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  onItemSelected(item: CanvasItem): void {
    this.selectionService.setSelectedItemKey(item.key);
  }

  onItemContextMenu(event: { item: CanvasItem; event: MouseEvent }): void {
    this.selectedItem = event.item;
    this.contextMenu.show(event.event);
  }

  renameNode(frameKey: string, name: string): void {
    this.canvasService.renameItem(name, frameKey);
    this.renameDialog.hide();
  }

  private initStoreSubscriptions(): void {
    this.canvasService.items$
      .pipe(takeUntil(this.destroy$))
      .subscribe((items) => {
        this.items = items || [];
      });

    this.selectionService.selectedItem$
      .pipe(takeUntil(this.destroy$))
      .subscribe(selectedItem => {
        this.selectedItem = selectedItem;
        this.selectedItemKey = selectedItem?.key;
      });
  }

  private openRenameDialog(): void {
    // Show rename dialog next to the context menu
    this.renameDialog.show(null);
  }
}
