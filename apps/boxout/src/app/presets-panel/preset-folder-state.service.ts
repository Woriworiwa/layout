import { Injectable, signal, computed, inject } from '@angular/core';
import { PresetCategory, PresetFolderState } from '@layout/models';
import { LocalStorageService } from '../core/services/local-storage.service';

const STORAGE_KEY = 'preset-folder-state';
const DEFAULT_EXPANDED_FOLDER = PresetCategory.FLEXBOX;

@Injectable()
export class PresetFolderStateService {
  private localStorageService = inject(LocalStorageService);
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
    return this.localStorageService.getItem<PresetFolderState>(STORAGE_KEY, {
      [DEFAULT_EXPANDED_FOLDER]: true,
    }) as PresetFolderState;
  }

  private saveState(): void {
    this.localStorageService.setItem(STORAGE_KEY, this.folderState());
  }
}
