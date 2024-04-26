import {Component, Renderer2, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TreeModule, TreeNodeContextMenuSelectEvent, TreeNodeDropEvent} from "primeng/tree";
import {MenuItem, TreeDragDropService, TreeNode} from "primeng/api";
import {CanvasStore} from "../../store/canvas.store";
import {CanvasItem} from "../../models/canvas-item.model";
import {FormsModule} from "@angular/forms";
import {CdkDropList} from "@angular/cdk/drag-drop";
import {InsertComponent} from "../insert/insert.component";
import {ToggleButtonModule} from "primeng/togglebutton";
import {FrameType} from "../../models/enums";
import {CANVAS_WRAPPER_ID} from "../../models/constants";
import {ContextMenuModule} from "primeng/contextmenu";
import {OverlayPanel, OverlayPanelModule} from "primeng/overlaypanel";
import {ButtonModule} from "primeng/button";
import {InputTextModule} from "primeng/inputtext";

@Component({
  selector: 'app-structure-tree',
  standalone: true,
  imports: [CommonModule, TreeModule, FormsModule, CdkDropList, InsertComponent, ToggleButtonModule, ContextMenuModule, OverlayPanelModule, ButtonModule, InputTextModule],
  providers: [TreeDragDropService],
  templateUrl: './structure-tree.component.html',
  styleUrls: ['./structure-tree.component.scss']
})
export class StructureTreeComponent {
  @ViewChild(OverlayPanel) renameDialog!: OverlayPanel;

  treeNodes!: TreeNode<CanvasItem>[];
  selectedItems: CanvasItem | undefined = undefined;

  contextMenuItems: MenuItem[] = [
    {label: 'Rename', icon: 'pi pi-search', command: (event: any) => this.openRenameDialog(event)},
  ]

  contextMenuEvent: Event | undefined;

  constructor(private canvasStore: CanvasStore) {
  }

  ngOnInit() {
    this.initStoreSubscriptions();
  }

  onNodeSelectionChanged(treeNode: TreeNode<CanvasItem> | TreeNode<CanvasItem>[] | null) {
    if (treeNode != null && !Array.isArray(treeNode)) {
      this.canvasStore.setSelectedFrameKey(treeNode.key);
    }
  }

  onNodeDrop($event: TreeNodeDropEvent) {
    this.canvasStore.frames = this.convertTreeNodesToFrames(this.treeNodes);
  }

  onNodeContextMenu(event: TreeNodeContextMenuSelectEvent) {
    this.contextMenuEvent = event.originalEvent;
  }

  renameNode(frameKey: string, name: string) {
    this.canvasStore.renameItem(frameKey, name);
    this.renameDialog.hide();
  }

  private convertFramesToTreeNodes(frames: CanvasItem[] | undefined): TreeNode<CanvasItem>[] {
    if (!frames) return [];

    return frames.map((frame) => {
      return {
        label: frame.name || frame.frameType,
        key: frame.key,
        icon: this.getTreeNodeIcon(frame),
        children: this.convertFramesToTreeNodes(frame.children),
        data: frame
      }
    });
  }

  private openRenameDialog(event: any) {
    this.renameDialog.toggle(event.originalEvent, this.contextMenuEvent?.target);
  }

  private initStoreSubscriptions() {
    this.canvasStore.frames$
      .subscribe((items) => {
        if (!items) {
          return;
        }

        this.treeNodes = this.convertFramesToTreeNodes(items)
      });

    this.canvasStore.selectedFrame$
      .subscribe(selectedItem => {
        this.selectedItems = selectedItem;
        if (selectedItem) {
          this.expandNode(this.treeNodes, selectedItem!, undefined);
        }
      })
  }

  private convertTreeNodesToFrames(nodes: TreeNode<CanvasItem>[]): CanvasItem[] {
    return nodes.map((node) => {
      return {
        ...node.data as CanvasItem,
        children: this.convertTreeNodesToFrames(node.children || [])
      }
    })
  }

  private expandNode(treeNodes: TreeNode<CanvasItem>[], targetItem: CanvasItem, parentNode: TreeNode<CanvasItem> | undefined) {
    treeNodes.forEach((node) => {
      if (node.data === targetItem && !node.expanded) {
        node.expanded = true;
        this.expandNode(this.treeNodes, parentNode?.data!, parentNode);
      } else {
        if (node.children && node.children) {
          this.expandNode(node.children, targetItem, node);
        }
      }
    });
  }

  private getTreeNodeIcon(frame: CanvasItem) {
    let icon = '';
    switch (frame.frameType) {
      case FrameType.FLEX:
        icon = 'pi pi-fw pi-bars';
        break;
      case FrameType.TEXT:
        icon = 'pi pi-fw pi-at'
    }

    return icon;
  }
}
