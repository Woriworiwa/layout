import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {TreeModule} from "primeng/tree";
import {TreeNode} from "primeng/api";
import {DataService} from "../services/data.service";

@Component({
  selector: 'app-layers',
  standalone: true,
  imports: [CommonModule, TreeModule],
  template: `
    <p-tree class="w-full md:w-30rem"
            [value]="files"
            [draggableNodes]="true"
            [droppableNodes]="true"
            draggableScope="self"
            droppableScope="self"
            selectionMode="single"></p-tree>
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
export class LayersComponent {
  files!: TreeNode[];

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.files = this.dataService.getTreeNodesData()

    this.files.forEach((node) => {
      this.expandRecursive(node, true);
    });

  }

  private expandRecursive(node: TreeNode, isExpand: boolean) {
    node.expanded = isExpand;
    if (node.children) {
      node.children.forEach((childNode) => {
        this.expandRecursive(childNode, isExpand);
      });
    }
  }
}
