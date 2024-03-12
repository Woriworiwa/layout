import {Component} from '@angular/core';
import { CommonModule } from '@angular/common';
import {TreeModule} from "primeng/tree";
import {TreeNode} from "primeng/api";
import {CanvasStore} from "../core/stores/canvas.store";
import {Frame} from "../core/models/frame.model";

@Component({
  selector: 'app-tree-selector',
  standalone: true,
  imports: [CommonModule, TreeModule],
  template: `
    <p-tree class="w-full md:w-30rem"
            [value]="files"
            [draggableNodes]="true"
            [droppableNodes]="true"
            draggableScope="self"
            droppableScope="self"
            selectionMode="single"
    (selectionChange)="onSelectionChanged($event)"></p-tree>
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
  files!: TreeNode<Frame>[];

  constructor(private frameStore: CanvasStore) {}

  ngOnInit() {
    this.frameStore.state.subscribe((state) => {
      if (!state.rootFrame) {
        return;
      }

      this.files = this.assignLabels([state.rootFrame])

      this.files.forEach((node) => {
        this.expandRecursive(node, true);
      });
    });
  }

  private assignLabels(frames: Frame[] | undefined): TreeNode<Frame>[] {
    if (!frames) return [];

     return  frames.map((frame) => {
       return {
         label: frame.name,
         key: frame.key,
         children: this.assignLabels(frame.children)
       }
     });
  }

  private expandRecursive(node: TreeNode<Frame>, isExpand: boolean) {
    node.expanded = isExpand;
    if (node.children) {
      node.children.forEach((childNode) => {
        this.expandRecursive(childNode, isExpand);
      });
    }
  }

  onSelectionChanged($event: TreeNode<Frame> | TreeNode<Frame>[] | null) {
    if ( $event != null && !Array.isArray($event)) {
      this.frameStore.setSelectedFrameKey($event.key);
    }
  }
}
