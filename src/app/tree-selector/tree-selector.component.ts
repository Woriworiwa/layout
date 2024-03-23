import {Component} from '@angular/core';
import { CommonModule } from '@angular/common';
import {TreeModule} from "primeng/tree";
import {TreeNode} from "primeng/api";
import {CanvasStore} from "../core/stores/canvas.store";
import {Frame} from "../core/frame.model";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-tree-selector',
  standalone: true,
  imports: [CommonModule, TreeModule, FormsModule],
  template: `
    <p-tree class="w-full md:w-30rem"
            [value]="frames"
            ngDefaultControl
            [(selection)]="selectedFrames"
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
  frames!: TreeNode<Frame>[];
  selectedFrames: TreeNode<Frame> | undefined = undefined;

  constructor(protected frameStore: CanvasStore) {}

  ngOnInit() {
    this.frameStore.rootFrame$.subscribe((rootFrame) => {
      if (!rootFrame) {
        return;
      }

      this.frames = this.assignLabels([rootFrame])

      this.frames.forEach((node) => {
        this.expandRecursive(node, true);
      });
    });

    this.frameStore.selectedFrame$.subscribe(selectedFrame => this.selectedFrames = selectedFrame)
  }


  private assignLabels(frames: Frame[] | undefined): TreeNode<Frame>[] {
    if (!frames) return [];

     return  frames.map((frame) => {
       return {
         label: frame.name || frame.key,
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
