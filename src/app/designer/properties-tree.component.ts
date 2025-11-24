import { Component, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { Tree } from 'primeng/tree';
import { TreeNode } from 'primeng/api';
import { InputText } from 'primeng/inputtext';
import { InputGroup } from 'primeng/inputgroup';
import { Button } from 'primeng/button';

import { CanvasItem } from '../core/models/canvas-item.model';
import { CanvasItemType } from '../core/enums';
import { SelectionService } from '../shared/canvas/selection/selection.service';
import { CanvasService } from '../shared/canvas/canvas.service';

// Import property group components
import { PropertiesFlexContainerComponent } from '../shared/properties/property-group/flex-container.component';
import { PropertiesFlexItemComponent } from '../shared/properties/property-group/flex-item.component';

@Component({
  selector: 'app-properties-tree',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    Tree,
    InputText,
    InputGroup,
    Button,
    PropertiesFlexContainerComponent,
    PropertiesFlexItemComponent
  ],
  templateUrl: './properties-tree.component.html',
  styleUrl: './properties-tree.component.scss',
})
export class PropertiesTreeComponent implements OnDestroy {
  protected canvasService = inject(CanvasService);
  protected selectionService = inject(SelectionService);

  frame: CanvasItem | undefined;
  searchText = '';
  treeNodes: TreeNode[] = [];

  protected readonly FrameType = CanvasItemType;
  private destroy$ = new Subject<void>();

  constructor() {
    this.selectionService.selectedItem$
      .pipe(takeUntil(this.destroy$))
      .subscribe(frame => {
        this.frame = frame;
        this.buildTreeStructure();
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private buildTreeStructure() {
    if (!this.frame) {
      this.treeNodes = [];
      return;
    }

    const nodes: TreeNode[] = [
      {
        key: 'layout',
        label: 'Layout',
        expanded: true,
        type: 'category',
        children: []
      }
    ];

    // Add Flex Container section only for flex items
    if (this.frame.itemType === CanvasItemType.FLEX) {
      nodes.push({
        key: 'flex-container',
        label: 'Flex Container',
        expanded: false,
        type: 'flex-container'
      });
    }

    // Add remaining sections
    nodes.push(
      {
        key: 'flex-item',
        label: 'Flex Item',
        expanded: false,
        type: 'flex-item'
      },
      {
        key: 'sizing',
        label: 'Sizing',
        expanded: false,
        type: 'category',
        children: []
      },
      {
        key: 'spacing',
        label: 'Spacing',
        expanded: false,
        type: 'category',
        children: []
      },
      {
        key: 'typography',
        label: 'Typography',
        expanded: false,
        type: 'category',
        children: []
      },
      {
        key: 'borders',
        label: 'Borders',
        expanded: false,
        type: 'category',
        children: []
      }
    );

    this.treeNodes = nodes;
  }

  clearSearch() {
    this.searchText = '';
  }
}
