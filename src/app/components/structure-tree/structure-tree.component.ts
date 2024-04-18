import {Component, Renderer2} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TreeModule, TreeNodeDropEvent} from "primeng/tree";
import {TreeDragDropService, TreeNode} from "primeng/api";
import {CanvasStore} from "../../store/canvas.store";
import {CanvasItem} from "../../models/canvas-item.model";
import {FormsModule} from "@angular/forms";
import {CdkDropList} from "@angular/cdk/drag-drop";
import {InsertComponent} from "../insert/insert.component";
import {ToggleButtonModule} from "primeng/togglebutton";
import {FrameType} from "../../models/enums";
import {CANVAS_WRAPPER_ID} from "../../models/constants";

@Component({
  selector: 'app-structure-tree',
  standalone: true,
  imports: [CommonModule, TreeModule, FormsModule, CdkDropList, InsertComponent, ToggleButtonModule],
  providers: [TreeDragDropService],
  templateUrl: './structure-tree.component.html',
  styleUrls: ['./structure-tree.component.scss']
})
export class StructureTreeComponent {
  treeNodes!: TreeNode<CanvasItem>[];
  selectedFrames: TreeNode<CanvasItem> | undefined = undefined;

  constructor(private canvasStore: CanvasStore, private renderer: Renderer2) {}

  ngOnInit() {
    this.canvasStore.frames$.subscribe((rootFrames) => {
      if (!rootFrames) {
        return;
      }

      this.treeNodes = this.convertFramesToTreeNodes(rootFrames)
    });

    this.canvasStore.selectedFrame$.subscribe(selectedFrame => {
      this.selectedFrames = selectedFrame;
      this.expandNode(this.treeNodes, undefined, selectedFrame!, 'down');
    })
  }

  onSelectionChanged(treeNode: TreeNode<CanvasItem> | TreeNode<CanvasItem>[] | null) {
    if ( treeNode != null && !Array.isArray(treeNode)) {
      this.canvasStore.setSelectedFrameKey(treeNode.key);
    }
  }

  onNodeDrop($event: TreeNodeDropEvent) {
    this.canvasStore.frames = this.convertTreeNodesToFrames(this.treeNodes);
  }

  private convertFramesToTreeNodes(frames: CanvasItem[] | undefined): TreeNode<CanvasItem>[] {
    if (!frames) return [];

     return  frames.map((frame) => {
       return {
         label: frame.name || frame.frameType,
         key: frame.key,
         icon: this.getTreeNodeIcon(frame),
         children: this.convertFramesToTreeNodes(frame.children),
         data: frame
       }
     });
  }

  private convertTreeNodesToFrames(nodes: TreeNode<CanvasItem>[]): CanvasItem[] {
    return nodes.map((node) => {
      return {
        ...node.data as CanvasItem,
        children: this.convertTreeNodesToFrames(node.children || [])
      }
    })
  }

  private expandNode(treeNodes: TreeNode<CanvasItem>[], parentNode: TreeNode<CanvasItem> | undefined, frame: CanvasItem, direction: 'up' | 'down') {
    treeNodes.forEach((node) => {
      if (node.data === frame) {
        node.expanded = true;

        if (parentNode) {
          parentNode.expanded = true;

          if (parentNode.data?.key !== CANVAS_WRAPPER_ID){
            this.expandNode(this.treeNodes, node, node.data!, 'up');
          }
        }

      } else {
        if (direction === 'down') {
          this.expandNode(node.children || [], node, frame, 'down');
        }
      }
    });
  }

  private expandRecursive(node: TreeNode<CanvasItem>, isExpand: boolean) {
    node.expanded = isExpand;
    if (node.children) {
      node.children.forEach((childNode) => {
        this.expandRecursive(childNode, isExpand);
      });
    }
  }

  private getTreeNodeIcon(frame: CanvasItem){
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
