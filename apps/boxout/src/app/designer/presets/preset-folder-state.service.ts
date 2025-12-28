import { Injectable, signal, computed } from '@angular/core';
import { PresetCategory, PresetFolderState } from '../../core/models/preset.model';

const STORAGE_KEY = 'preset-folder-state';
const DEFAULT_EXPANDED_FOLDER = PresetCategory.FLEXBOX;

@Injectable()
export class PresetFolderStateService {
  private folderState = signal<PresetFolderState>(this.loadState());

  isExpanded(categoryId: PresetCategory): boolean {
    return this.folderState()[categoryId] ?? false;
  }

  toggleFolder(categoryId: PresetCategory): void {
    const current = this.folderState();
    this.folderState.set({
      ...current,
      [categoryId]: !current[categoryId],
    });
    this.saveState();
  }

  getFolderExpanded(categoryId: PresetCategory) {
    return computed(() => this.folderState()[categoryId] ?? false);
  }

  private loadState(): PresetFolderState {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Failed to load preset folder state:', error);
    }

    return {
      [DEFAULT_EXPANDED_FOLDER]: true,
    };
  }

  private saveState(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.folderState()));
    } catch (error) {
      console.warn('Failed to save preset folder state:', error);
    }
  }
}
