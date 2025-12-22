import {
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  inject,
  ElementRef,
  Renderer2,
} from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';

import {
  Tree,
  TreeNodeContextMenuSelectEvent
} from 'primeng/tree';
import {
  MenuItem,
  MenuItemCommandEvent,
  TreeDragDropService,
  TreeNode,
} from 'primeng/api';
import { CanvasItem } from '@layout/models';
import { FormsModule } from '@angular/forms';
import { CanvasItemType } from "@layout/canvas"
import { ContextMenu } from 'primeng/contextmenu';
import { Popover } from 'primeng/popover';
import { Button } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { CanvasService, SelectionService } from '@layout/canvas';
import { Subject, takeUntil } from 'rxjs';
import { UiGuidanceService } from '../../core/services/ui-guidance.service';

@Component({
  selector: 'app-layers',
  imports: [Tree, FormsModule, ContextMenu, Popover, Button, InputText],
  providers: [TreeDragDropService],
  templateUrl: './layers.component.html',
  styleUrls: ['./layers.component.scss'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-10px)' }),
        animate(
          '300ms ease-out',
          style({ opacity: 1, transform: 'translateY(0)' }),
        ),
      ]),
      transition(':leave', [
        animate(
          '300ms ease-in',
          style({ opacity: 0, transform: 'translateY(-10px)' }),
        ),
      ]),
    ]),
  ],
})
export class LayersComponent implements OnInit, OnDestroy {
  private canvasService = inject(CanvasService);
  private selectionService = inject(SelectionService);
  private uiGuidanceService = inject(UiGuidanceService);
  private elementRef = inject(ElementRef);
  private renderer = inject(Renderer2);

  @ViewChild(Popover) renameDialog!: Popover;

  treeNodes!: TreeNode<CanvasItem>[];
  selectedItems: CanvasItem | undefined = undefined;
  contextMenuEvent: Event | undefined;
  expandedNodes: string[] = [];
  showGuidanceMessage = false;
  private guidanceMessageTimeout: any;

  private destroy$ = new Subject();

  contextMenuItems: MenuItem[] = [
    {
      label: 'Rename',
      icon: 'pi pi-search',
      command: (event: MenuItemCommandEvent) => this.openRenameDialog(event),
    },
  ];

  ngOnInit() {
    this.initStoreSubscriptions();
    this.initGuidanceSubscription();
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
    if (this.guidanceMessageTimeout) {
      clearTimeout(this.guidanceMessageTimeout);
    }
  }

  onTreeSelectionChanged(
    treeNode: TreeNode<CanvasItem> | TreeNode<CanvasItem>[] | null | undefined,
  ) {
    if (treeNode != null && !Array.isArray(treeNode)) {
      this.selectionService.setSelectedItemKey(treeNode.key);
    }
  }

  onNodeDrop() {
    this.canvasService.setItems(
      this.convertTreeNodesToCanvasItems(this.treeNodes),
    );
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

        this.treeNodes = this.convertCanvasItemsToTreeNodes(items);

        /* preserve the previous expanded nodes state of the tree */
        this.expandedNodes.forEach((node) => {
          this.expandNodeAndItsParents(this.treeNodes, node, undefined);
        });
      });

    this.selectionService.selectedItem$
      .pipe(takeUntil(this.destroy$))
      .subscribe((selectedItem) => {
        this.selectedItems = selectedItem;
        if (selectedItem && selectedItem.key) {
          this.expandNodeAndItsParents(
            this.treeNodes,
            selectedItem.key,
            undefined,
          );
        }
      });
  }

  private convertCanvasItemsToTreeNodes(
    canvasItems: CanvasItem[] | undefined,
  ): TreeNode<CanvasItem>[] {
    if (!canvasItems) return [];

    return canvasItems.map((frame) => {
      return {
        label: frame.label || frame.content || frame.itemType,
        key: frame.key,
        icon: this.getTreeNodeIcon(frame),
        children: this.convertCanvasItemsToTreeNodes(frame.children),
        data: frame,
      };
    });
  }

  private openRenameDialog(event: MenuItemCommandEvent) {
    this.renameDialog.toggle(
      event.originalEvent,
      this.contextMenuEvent?.target,
    );
  }

  private convertTreeNodesToCanvasItems(
    treeNodes: TreeNode<CanvasItem>[],
  ): CanvasItem[] {
    return treeNodes.map((node) => {
      return {
        ...(node.data as CanvasItem),
        children: this.convertTreeNodesToCanvasItems(node.children || []),
      };
    });
  }

  private expandNodeAndItsParents(
    treeNodes: TreeNode<CanvasItem>[],
    targetItemKey: string,
    parentNode: TreeNode<CanvasItem> | undefined,
  ) {
    treeNodes.forEach((node) => {
      if (
        parentNode?.data?.key &&
        node.key &&
        node.data?.key === targetItemKey &&
        !node.expanded
      ) {
        node.expanded = true;
        this.expandedNodes.push(node.key);
        this.expandNodeAndItsParents(
          this.treeNodes,
          parentNode?.data?.key,
          parentNode,
        );
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
        icon = 'pi pi-fw pi-at';
    }

    return icon;
  }

  protected themeOverrides = {
    root: {
      gap: '0',
      padding: '0',
      background: 'var(--background-primary)',
    },
  };

  private initGuidanceSubscription() {
    this.uiGuidanceService.guidanceEvent$
      .pipe(takeUntil(this.destroy$))
      .subscribe((event) => {
        if (event.target === 'layers-panel' && event.action === 'highlight') {
          this.highlightPanel();
        }
      });
  }

  private highlightPanel() {
    // Show guidance message only (no border highlight)
    this.showGuidanceMessage = true;

    // Clear existing timeout if any
    if (this.guidanceMessageTimeout) {
      clearTimeout(this.guidanceMessageTimeout);
    }

    // Hide message after 3 seconds
    this.guidanceMessageTimeout = setTimeout(() => {
      this.showGuidanceMessage = false;
    }, 3000);
  }
}
