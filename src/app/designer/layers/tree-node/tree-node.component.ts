import {
  Component,
  input,
  output,
  computed,
  signal,
  effect
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { CanvasItem } from '../../../core/models/canvas-item.model';
import { CanvasItemType } from '../../../core/enums';

export interface TreeNodeData {
  item: CanvasItem;
  level: number;
  expanded: boolean;
  selected: boolean;
  hasChildren: boolean;
}

@Component({
  selector: 'app-tree-node',
  imports: [CommonModule],
  templateUrl: './tree-node.component.html',
  styleUrls: ['./tree-node.component.scss']
})
export class TreeNodeComponent {
  // Inputs
  item = input.required<CanvasItem>();
  level = input<number>(0);
  selectedKey = input<string | undefined>();
  expandedKeys = input<Set<string>>(new Set());
  searchTerm = input<string>('');

  // Outputs
  itemSelected = output<CanvasItem>();
  itemExpanded = output<{ item: CanvasItem; expanded: boolean }>();
  itemContextMenu = output<{ item: CanvasItem; event: MouseEvent }>();

  // Local state
  isExpanded = signal(false);

  // Computed
  isSelected = computed(() => this.selectedKey() === this.item().key);
  hasChildren = computed(() => this.item().children && this.item().children!.length > 0);

  displayLabel = computed(() => {
    const item = this.item();
    return item.label || item.content || item.itemType;
  });

  icon = computed(() => this.getIcon(this.item()));

  matchesSearch = computed(() => {
    const search = this.searchTerm().toLowerCase();
    if (!search) return true;

    const label = this.displayLabel().toLowerCase();
    return label.includes(search);
  });

  // Sync expanded state with parent
  constructor() {
    effect(() => {
      const key = this.item().key;
      if (key) {
        this.isExpanded.set(this.expandedKeys().has(key));
      }
    }, { allowSignalWrites: true });
  }

  toggleExpand(): void {
    if (!this.hasChildren()) return;

    const newExpandedState = !this.isExpanded();
    this.isExpanded.set(newExpandedState);
    this.itemExpanded.emit({ item: this.item(), expanded: newExpandedState });
  }

  selectItem(event: MouseEvent): void {
    event.stopPropagation();
    this.itemSelected.emit(this.item());
  }

  onContextMenu(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.itemContextMenu.emit({ item: this.item(), event });
  }

  private getIcon(item: CanvasItem): string {
    switch (item.itemType) {
      case CanvasItemType.FLEX:
        return 'pi pi-bars';
      case CanvasItemType.GRID:
        return 'pi pi-th-large';
      case CanvasItemType.TEXT:
        return 'pi pi-align-left';
      default:
        return 'pi pi-box';
    }
  }

  // For template
  get indentStyle() {
    return {
      'padding-left': `${this.level() * 16 + 8}px`
    };
  }
}
