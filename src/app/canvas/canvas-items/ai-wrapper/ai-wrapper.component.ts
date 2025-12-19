import {
  Component,
  signal,
  inject,
  ChangeDetectionStrategy,
  input,
  OnInit,
} from '@angular/core';

import { FormsModule } from '@angular/forms';
import { TextareaModule } from 'primeng/textarea';
import { ButtonDirective } from 'primeng/button';
import { CanvasItem } from '../../../core/models/canvas-item.model';
import { AiGenerationService } from '../../../core/services/ai-generation.service';
import { CanvasService } from '../../canvas.service';
import cloneDeep from 'lodash.clonedeep';

@Component({
  selector: 'app-ai-wrapper',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, TextareaModule, ButtonDirective],
  templateUrl: './ai-wrapper.component.html',
  styleUrls: ['./ai-wrapper.component.scss'],
})
export class AiWrapperComponent implements OnInit {
  private aiService = inject(AiGenerationService);
  private canvasService = inject(CanvasService);

  item = input.required<CanvasItem>();
  protected prompt = signal<string>('');
  protected isGenerating = signal<boolean>(false);
  protected errorMessage = signal<string | null>(null);
  protected isCollapsed = signal<boolean>(false);

  ngOnInit(): void {
    // Initialize prompt from metadata
    if (this.item()?.aiMetadata?.prompt) {
      this.prompt.set(this.item()?.aiMetadata?.prompt || '');
    }
  }

  protected onPromptChange(value: string): void {
    this.prompt.set(value);

    // Update the item's metadata
    if (this.item() && this.item()?.aiMetadata) {
      this.item()!.aiMetadata!.prompt = value;
    }
  }

  protected onGenerate(): void {
    const promptValue = this.prompt();
    if (!promptValue.trim()) {
      this.errorMessage.set('Please enter a description');
      return;
    }

    this.isGenerating.set(true);
    this.errorMessage.set(null);

    this.aiService.generateLayout(promptValue).subscribe({
      next: (response) => {
        this.handleGenerationSuccess(response.items);
        this.isGenerating.set(false);
      },
      error: (error) => {
        this.errorMessage.set(error.message || 'Generation failed');
        this.isGenerating.set(false);
      },
    });
  }

  protected removeAiWrapper(): void {
    if (!this.item()?.key) return;
    this.canvasService.removeAiWrapper(this.item()!.key!);
  }

  protected toggleCollapse(): void {
    this.isCollapsed.set(!this.isCollapsed());
  }

  private handleGenerationSuccess(items: CanvasItem[]): void {
    if (!this.item()?.key) return;

    // Clone the entire canvas items tree
    const allItems = cloneDeep(this.canvasService.items);

    // Find this item in the tree
    const updatedItem = this.findItemByKey(allItems, this.item()!.key!);

    if (updatedItem) {
      // Replace children with generated items
      updatedItem.children = items;

      // Update metadata
      if (updatedItem.aiMetadata) {
        updatedItem.aiMetadata.lastError = undefined;
      }

      // Trigger state update
      this.canvasService.setItems(allItems);
    }
  }

  private findItemByKey(
    items: CanvasItem[],
    key: string,
  ): CanvasItem | undefined {
    for (const item of items) {
      if (item.key === key) {
        return item;
      }
      if (item.children) {
        const found = this.findItemByKey(item.children, key);
        if (found) return found;
      }
    }
    return undefined;
  }
}
