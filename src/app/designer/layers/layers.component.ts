import { Component, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';

import {TreeModule, TreeNodeContextMenuSelectEvent, TreeNodeExpandEvent} from "primeng/tree";
import {MenuItem, TreeDragDropService, TreeNode} from "primeng/api";
import {CanvasItem} from "../../core/models/canvas-item.model";
import {FormsModule} from "@angular/forms";
import {ToggleButtonModule} from "primeng/togglebutton";
import {CanvasItemType} from "../../core/enums";
import {ContextMenuModule} from "primeng/contextmenu";
import {OverlayPanel, OverlayPanelModule} from "primeng/overlaypanel";
import {ButtonModule} from "primeng/button";
import {InputTextModule} from "primeng/inputtext";
import {ToastModule} from "primeng/toast";
import {CanvasService} from "../../shared/canvas/canvas.service";
import {SelectionService} from "../../shared/canvas/selection/selection.service";
import {Subject, takeUntil} from "rxjs";

@Component({
    selector: 'app-layers',
    imports: [TreeModule, FormsModule, ToggleButtonModule, ContextMenuModule, OverlayPanelModule, ButtonModule, InputTextModule, ToastModule],
    providers: [TreeDragDropService],
    templateUrl: './layers.component.html',
    styleUrls: ['./layers.component.scss']
})
export class LayersComponent implements OnInit, OnDestroy {
  private canvasService = inject(CanvasService);
  private selectionService = inject(SelectionService);

  @ViewChild(OverlayPanel) renameDialog!: OverlayPanel;

  treeNodes!: TreeNode<CanvasItem>[];
  selectedItems: CanvasItem | undefined = undefined;
  contextMenuEvent: Event | undefined;
  expandedNodes: string[] = [];

  private destroy$ = new Subject();

  contextMenuItems: MenuItem[] = [
    {label: 'Rename', icon: 'pi pi-search', command: (event: any) => this.openRenameDialog(event)},
  ]

  ngOnInit() {
    this.initStoreSubscriptions();
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  onTreeSelectionChanged(treeNode: TreeNode<CanvasItem> | TreeNode<CanvasItem>[] | null) {
    if (treeNode != null && !Array.isArray(treeNode)) {
      this.selectionService.setSelectedItemKey(treeNode.key);
    }
  }

  onNodeDrop() {
    this.canvasService.setItems(this.convertTreeNodesToCanvasItems(this.treeNodes));
  }

  onNodeContextMenu(event: TreeNodeContextMenuSelectEvent) {
    this.contextMenuEvent = event.originalEvent;
  }

  renameNode(frameKey: string, name: string) {
    this.canvasService.renameItem(name, frameKey);
    this.renameDialog.hide();
  }

  private initStoreSubscriptions() {
    this.canvasService.items$
      .pipe(takeUntil(this.destroy$))
      .subscribe((items) => {
        if (!items) {
          return;
        }

        this.treeNodes = this.convertCanvasItemsToTreeNodes(items)

        /* preserve the previous expanded nodes state of the tree */
        this.expandedNodes.forEach(node => {
          this.expandNodeAndItsParents(this.treeNodes, node, undefined);
        })
      });

    this.selectionService.selectedItem$
      .pipe(takeUntil(this.destroy$))
      .subscribe(selectedItem => {
        this.selectedItems = selectedItem;
        if (selectedItem && selectedItem.key) {
          this.expandNodeAndItsParents(this.treeNodes, selectedItem.key, undefined);
        }
      })
  }

  private convertCanvasItemsToTreeNodes(canvasItems: CanvasItem[] | undefined): TreeNode<CanvasItem>[] {
    if (!canvasItems) return [];

    return canvasItems.map((frame) => {
      return {
        label: frame.label || frame.content || frame.itemType,
        key: frame.key,
        icon: this.getTreeNodeIcon(frame),
        children: this.convertCanvasItemsToTreeNodes(frame.children),
        data: frame
      }
    });
  }

  private openRenameDialog(event: any) {
    this.renameDialog.toggle(event.originalEvent, this.contextMenuEvent?.target);
  }

  private convertTreeNodesToCanvasItems(treeNodes: TreeNode<CanvasItem>[]): CanvasItem[] {
    return treeNodes.map((node) => {
      return {
        ...node.data as CanvasItem,
        children: this.convertTreeNodesToCanvasItems(node.children || [])
      }
    })
  }

  private expandNodeAndItsParents(treeNodes: TreeNode<CanvasItem>[], targetItemKey: string, parentNode: TreeNode<CanvasItem> | undefined) {
    treeNodes.forEach((node) => {
      if (parentNode?.data?.key && node.key && node.data?.key === targetItemKey && !node.expanded) {
        node.expanded = true;
        this.expandedNodes.push(node.key);
        this.expandNodeAndItsParents(this.treeNodes, parentNode?.data?.key, parentNode);
      } else {
        if (node.children && node.children) {
          this.expandNodeAndItsParents(node.children, targetItemKey, node);
        }
      }
    });
  }

  private getTreeNodeIcon(canvasItem: CanvasItem) {
    let icon = '';
    switch (canvasItem.itemType) {
      case CanvasItemType.FLEX:
        icon = 'pi pi-fw pi-bars';
        break;
      case CanvasItemType.TEXT:
        icon = 'pi pi-fw pi-at'
    }

    return icon;
  }

  onNodeExpand($event: TreeNodeExpandEvent) {
    console.log($event.node.key);
  }
}
