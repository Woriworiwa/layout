import {Component, OnInit, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TreeModule, TreeNodeContextMenuSelectEvent, TreeNodeExpandEvent} from "primeng/tree";
import {MenuItem, TreeDragDropService, TreeNode} from "primeng/api";
import {CanvasStore} from "../../store/canvas.store";
import {CanvasItem} from "../../models/canvas-item.model";
import {FormsModule} from "@angular/forms";
import {CdkDropList} from "@angular/cdk/drag-drop";
import {InsertComponent} from "../insert/insert.component";
import {ToggleButtonModule} from "primeng/togglebutton";
import {CanvasItemType} from "../../models/enums";
import {ContextMenuModule} from "primeng/contextmenu";
import {OverlayPanel, OverlayPanelModule} from "primeng/overlaypanel";
import {ButtonModule} from "primeng/button";
import {InputTextModule} from "primeng/inputtext";
import {ToastModule} from "primeng/toast";

@Component({
  selector: 'app-structure-tree',
  standalone: true,
  imports: [CommonModule, TreeModule, FormsModule, CdkDropList, InsertComponent, ToggleButtonModule, ContextMenuModule, OverlayPanelModule, ButtonModule, InputTextModule, ToastModule],
  providers: [TreeDragDropService],
  templateUrl: './structure-tree.component.html',
  styleUrls: ['./structure-tree.component.scss']
})
export class StructureTreeComponent implements OnInit {
  @ViewChild(OverlayPanel) renameDialog!: OverlayPanel;

  treeNodes!: TreeNode<CanvasItem>[];
  selectedItems: CanvasItem | undefined = undefined;
  contextMenuEvent: Event | undefined;
  expandedNodes: string[] = [];

  contextMenuItems: MenuItem[] = [
    {label: 'Rename', icon: 'pi pi-search', command: (event: any) => this.openRenameDialog(event)},
  ]

  constructor(private canvasStore: CanvasStore) {
  }

  ngOnInit() {
    this.initStoreSubscriptions();
  }

  onTreeSelectionChanged(treeNode: TreeNode<CanvasItem> | TreeNode<CanvasItem>[] | null) {
    if (treeNode != null && !Array.isArray(treeNode)) {
      this.canvasStore.setSelectedCanvasItemKey(treeNode.key);
    }
  }

  onNodeDrop() {
    this.canvasStore.setCanvasItems(this.convertTreeNodesToCanvasItems(this.treeNodes));
  }

  onNodeContextMenu(event: TreeNodeContextMenuSelectEvent) {
    this.contextMenuEvent = event.originalEvent;
  }

  renameNode(frameKey: string, name: string) {
    this.canvasStore.renameItem(frameKey, name);
    this.renameDialog.hide();
  }

  private initStoreSubscriptions() {
    this.canvasStore.canvasItems$
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

    this.canvasStore.selectedCanvasItem$
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
