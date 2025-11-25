import {
  Component,
  input,
  output,
  signal,
  computed,
  effect,
  ViewChild,
  ElementRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputText } from 'primeng/inputtext';
import { ButtonDirective } from 'primeng/button';
import { CanvasItem } from '../../../core/models/canvas-item.model';
import { TreeNodeComponent } from '../tree-node/tree-node.component';

@Component({
  selector: 'app-custom-tree',
  imports: [
    CommonModule,
    FormsModule,
    InputText,
    ButtonDirective,
    TreeNodeComponent
  ],
  templateUrl: './custom-tree.component.html',
  styleUrls: ['./custom-tree.component.scss']
})
export class CustomTreeComponent {
  @ViewChild('searchInput') searchInput?: ElementRef<HTMLInputElement>;

  // Inputs
  items = input<CanvasItem[]>([]);
  selectedKey = input<string | undefined>();

  // Outputs
  itemSelected = output<CanvasItem>();
  itemContextMenu = output<{ item: CanvasItem; event: MouseEvent }>();

  // Local state
  searchTerm = signal('');
  expandedKeys = signal<Set<string>>(new Set());
  showSearch = signal(false);

  // Computed
  hasItems = computed(() => this.items().length > 0);
  isSearching = computed(() => this.searchTerm().length > 0);

  constructor() {
    // Auto-expand nodes when searching
    effect(() => {
      const search = this.searchTerm();
      if (search) {
        this.expandAllNodes();
      }
    });

    // Auto-expand parent nodes when an item is selected
    effect(() => {
      const key = this.selectedKey();
      if (key) {
        this.expandToNode(key);
      }
    });
  }

  onItemSelected(item: CanvasItem): void {
    this.itemSelected.emit(item);
  }

  onItemExpanded(event: { item: CanvasItem; expanded: boolean }): void {
    const key = event.item.key;
    if (!key) return;

    const keys = new Set(this.expandedKeys());
    if (event.expanded) {
      keys.add(key);
    } else {
      keys.delete(key);
    }
    this.expandedKeys.set(keys);
  }

  onItemContextMenu(event: { item: CanvasItem; event: MouseEvent }): void {
    this.itemContextMenu.emit(event);
  }

  toggleSearch(): void {
    const newState = !this.showSearch();
    this.showSearch.set(newState);

    if (!newState) {
      this.searchTerm.set('');
    } else {
      // Focus search input after it's rendered
      setTimeout(() => {
        this.searchInput?.nativeElement.focus();
      }, 0);
    }
  }

  clearSearch(): void {
    this.searchTerm.set('');
    this.searchInput?.nativeElement.focus();
  }

  private expandAllNodes(): void {
    const keys = new Set<string>();
    const collectKeys = (items: CanvasItem[]) => {
      items.forEach(item => {
        if (item.key && item.children && item.children.length > 0) {
          keys.add(item.key);
          collectKeys(item.children);
        }
      });
    };
    collectKeys(this.items());
    this.expandedKeys.set(keys);
  }

  private expandToNode(targetKey: string): void {
    const keys = new Set(this.expandedKeys());

    const findAndExpandParents = (items: CanvasItem[], parentKeys: string[] = []): boolean => {
      for (const item of items) {
        if (item.key === targetKey) {
          // Found target, expand all parents
          parentKeys.forEach(key => keys.add(key));
          return true;
        }

        if (item.children && item.children.length > 0) {
          const newParentKeys = item.key ? [...parentKeys, item.key] : parentKeys;
          if (findAndExpandParents(item.children, newParentKeys)) {
            return true;
          }
        }
      }
      return false;
    };

    findAndExpandParents(this.items());
    this.expandedKeys.set(keys);
  }

  collapseAll(): void {
    this.expandedKeys.set(new Set());
  }

  expandAll(): void {
    this.expandAllNodes();
  }
}
