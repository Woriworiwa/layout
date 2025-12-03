import { Directive, ElementRef, HostListener, Input, Renderer2, inject, OnInit, Optional, Host } from '@angular/core';
import { AssetDragDropService } from '../designer/assets/asset-drag-drop.service';
import { CanvasItem } from '../core/models/canvas-item.model';
import { InsertPosition, CanvasItemType } from '../core/enums';
import { CanvasItemComponent } from './canvas-items/canvas-item.component';

@Directive({
  selector: '[appAssetDrop]',
  standalone: true
})
export class AssetDropDirective implements OnInit {
  private elementRef = inject(ElementRef);
  private renderer = inject(Renderer2);
  private assetDragDropService = inject(AssetDragDropService);

  // Optionally inject the host component to get the item
  @Optional() @Host() private hostComponent?: CanvasItemComponent;

  @Input() appAssetDrop?: CanvasItem;

  private dropPosition: InsertPosition | null = null;

  ngOnInit(): void {
    // If no input provided, try to get item from host component
    if (!this.appAssetDrop && this.hostComponent) {
      this.appAssetDrop = this.hostComponent.item;
    }
  }

  private getItem(): CanvasItem | undefined {
    // Use explicit input first, fall back to host component's item
    return this.appAssetDrop || this.hostComponent?.item;
  }

  @HostListener('dragover', ['$event'])
  onDragOver(event: DragEvent): void {
    const item = this.getItem();
    const presetData = event.dataTransfer?.types.includes('application/x-asset-preset');
    if (!presetData || !item?.key) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    // Calculate drop position based on mouse position
    const rect = this.elementRef.nativeElement.getBoundingClientRect();
    const position = this.calculateDropPosition(event, rect, item);

    this.dropPosition = position;
    this.assetDragDropService.setDropTarget(item.key, position);

    // Show visual feedback
    this.updateDropIndicator(position);
  }

  @HostListener('dragleave', ['$event'])
  onDragLeave(event: DragEvent): void {
    event.stopPropagation();

    // Only clear if we're actually leaving this element (not entering a child)
    const relatedTarget = event.relatedTarget as HTMLElement;
    if (!this.elementRef.nativeElement.contains(relatedTarget)) {
      this.dropPosition = null;
      this.clearDropIndicator();
    }
  }

  @HostListener('drop', ['$event'])
  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();

    this.dropPosition = null;
    this.clearDropIndicator();
  }

  private calculateDropPosition(event: DragEvent, rect: DOMRect, item: CanvasItem): InsertPosition {
    // For container items (FLEX), prefer INSIDE
    if (item.itemType === CanvasItemType.FLEX) {
      const mouseY = event.clientY - rect.top;
      const height = rect.height;

      // Top 20% = BEFORE
      if (mouseY < height * 0.2) {
        return InsertPosition.BEFORE;
      }
      // Bottom 20% = AFTER
      if (mouseY > height * 0.8) {
        return InsertPosition.AFTER;
      }
      // Middle 60% = INSIDE
      return InsertPosition.INSIDE;
    }

    // For non-container items (TEXT), only BEFORE or AFTER
    const mouseY = event.clientY - rect.top;
    const height = rect.height;

    return mouseY < height / 2 ? InsertPosition.BEFORE : InsertPosition.AFTER;
  }

  private updateDropIndicator(position: InsertPosition): void {
    const element = this.elementRef.nativeElement;

    // Remove all drop classes
    this.clearDropIndicator();

    // Add appropriate class
    switch (position) {
      case InsertPosition.BEFORE:
        this.renderer.addClass(element, 'drop-before');
        break;
      case InsertPosition.AFTER:
        this.renderer.addClass(element, 'drop-after');
        break;
      case InsertPosition.INSIDE:
        this.renderer.addClass(element, 'drop-inside');
        break;
    }
  }

  private clearDropIndicator(): void {
    const element = this.elementRef.nativeElement;
    this.renderer.removeClass(element, 'drop-before');
    this.renderer.removeClass(element, 'drop-after');
    this.renderer.removeClass(element, 'drop-inside');
  }
}
