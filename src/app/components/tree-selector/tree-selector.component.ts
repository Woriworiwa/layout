import {Component} from '@angular/core';
import { CommonModule } from '@angular/common';
import {TreeModule, TreeNodeDropEvent} from "primeng/tree";
import {TreeDragDropService, TreeNode} from "primeng/api";
import {CanvasStore} from "../../stores/canvas.store";
import {Frame} from "../../models/frame.model";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-tree-selector',
  standalone: true,
  imports: [CommonModule, TreeModule, FormsModule],
  providers: [TreeDragDropService],
  template: `
    <p-tree class="w-full md:w-30rem"
            [value]="treeNodes"
            ngDefaultControl
            [(selection)]="selectedFrames"
            selectionMode="single"
            (selectionChange)="onSelectionChanged($event)"
            [draggableNodes]="true"
            [droppableNodes]="true"
            draggableScope="self"
            droppableScope="self"
            (onNodeDrop)="onNodeDrop($event)">
    </p-tree>
  `,
  styles: `
    :host ::ng-deep {
      .p-treenode-selectable.p-highlight {
        color: white;
        background: #3a9afe;

        /* if it has a sibling change the border radius */
        &:has(+.p-treenode-children) {
          border-radius: 8px 8px 0 0;
        }

        /* sibling styles */
        &+ .p-treenode-children {
          background: #EFF6FF;
          border-radius: 0 0 8px 8px;
        }
      }
    }
  `
})
export class TreeSelectorComponent {
  treeNodes!: TreeNode<Frame>[];
  selectedFrames: TreeNode<Frame> | undefined = undefined;

  constructor(protected frameStore: CanvasStore) {}

  ngOnInit() {
    this.frameStore.rootFrame$.subscribe((rootFrame) => {
      if (!rootFrame) {
        return;
      }

      this.treeNodes = this.convertFramesToTreeNodes([rootFrame])

      this.treeNodes.forEach((node) => {
        this.expandRecursive(node, true);
      });
    });

    this.frameStore.selectedFrame$.subscribe(selectedFrame => this.selectedFrames = selectedFrame)
  }

  onSelectionChanged($event: TreeNode<Frame> | TreeNode<Frame>[] | null) {
    if ( $event != null && !Array.isArray($event)) {
      this.frameStore.setSelectedFrameKey($event.key);
    }
  }

  onNodeDrop($event: TreeNodeDropEvent) {
    const frames = this.convertTreeNodesToFrames(this.treeNodes);
    this.frameStore.setRootFrame(frames[0]);
  }

  private convertFramesToTreeNodes(frames: Frame[] | undefined): TreeNode<Frame>[] {
    if (!frames) return [];

     return  frames.map((frame) => {
       return {
         label: frame.name || frame.key,
         key: frame.key,
         children: this.convertFramesToTreeNodes(frame.children),
         data: frame
       }
     });
  }

  private convertTreeNodesToFrames(nodes: TreeNode<Frame>[]): Frame[] {
    return nodes.map((node) => {
      return {
        ...node.data as Frame,
        children: this.convertTreeNodesToFrames(node.children || [])
      }
    })
  }

  private expandRecursive(node: TreeNode<Frame>, isExpand: boolean) {
    node.expanded = isExpand;
    if (node.children) {
      node.children.forEach((childNode) => {
        this.expandRecursive(childNode, isExpand);
      });
    }
  }
}
