import { Injectable, inject, signal, computed } from '@angular/core';
import { Observable, firstValueFrom, map } from 'rxjs';
import { CanvasService, SelectionService } from '@layout/canvas';
import { CanvasItem } from '@layout/models';
import {
  Document,
  DocumentListItem,
  DOCUMENT_STORAGE,
  DocumentStorage,
  LocalStorageService,
} from '@layout/persistence';
import cloneDeep from 'lodash.clonedeep';

const CURRENT_DOCUMENT_KEY = 'CURRENT_DOCUMENT_ID';
const UNTITLED_COUNTER_KEY = 'UNTITLED_COUNTER';

/**
 * App-specific document type for canvas items.
 */
export type CanvasDocument = Document<CanvasItem>;

/**
 * Service for managing documents (save, open, new, etc.)
 * Handles dirty tracking and document lifecycle.
 */
@Injectable()
export class DocumentService {
  private storage = inject(DOCUMENT_STORAGE) as DocumentStorage<CanvasItem>;
  private canvasService = inject(CanvasService);
  private localStorageService = inject(LocalStorageService);
  private selectionService = inject(SelectionService);

  // Current document state
  private currentDocumentId = signal<string | null>(null);
  private currentDocumentName = signal<string>('Untitled 1');
  private lastSavedSnapshot = signal<string | null>(null);
  private untitledCounter = signal<number>(1);

  // Public readonly signals
  readonly documentId = this.currentDocumentId.asReadonly();
  readonly documentName = this.currentDocumentName.asReadonly();

  /**
   * Check if current document has unsaved changes.
   * Compares serialized current items with last saved snapshot.
   */
  readonly isDirty = computed(() => {
    const snapshot = this.lastSavedSnapshot();
    const currentItems = JSON.stringify(this.canvasService.items);

    if (snapshot === null) {
      // New document - dirty if there are any items
      return this.canvasService.items.length > 0;
    }

    return currentItems !== snapshot;
  });

  /**
   * Check if this is a new unsaved document.
   */
  readonly isNewDocument = computed(() => this.currentDocumentId() === null);

  /**
   * Initialize service and restore last document.
   */
  async initialize(): Promise<void> {
    this.loadPersistedState();
    await this.restoreLastDocument();
  }

  /**
   * Get list of all saved documents, sorted by last modified.
   */
  getDocuments(): Observable<DocumentListItem[]> {
    return this.storage
      .list()
      .pipe(map((docs) => docs.sort((a, b) => b.updatedAt - a.updatedAt)));
  }

  /**
   * Create a new blank document.
   * Does NOT check for unsaved changes - caller should handle that.
   */
  newDocument(): void {
    const name = this.generateUntitledName();
    this.currentDocumentId.set(null);
    this.currentDocumentName.set(name);
    this.lastSavedSnapshot.set(null);
    this.canvasService.setItems([], false);
    this.selectionService.setSelectedItemKey(undefined);
    this.clearPersistedDocumentId();
  }

  /**
   * Open an existing document by ID.
   * Does NOT check for unsaved changes - caller should handle that.
   */
  async openDocument(id: string): Promise<boolean> {
    const doc = await firstValueFrom(this.storage.get(id));
    if (!doc) {
      return false;
    }

    this.currentDocumentId.set(doc.id);
    this.currentDocumentName.set(doc.name);
    this.lastSavedSnapshot.set(JSON.stringify(doc.items));
    this.canvasService.setItems(cloneDeep(doc.items), false);
    this.persistCurrentDocumentId(doc.id);
    return true;
  }

  /**
   * Save the current document.
   * If new document, creates with current name.
   */
  async save(): Promise<CanvasDocument> {
    const existingId = this.currentDocumentId();
    const id = existingId ?? this.storage.generateId();
    const isNew = existingId === null;
    const now = Date.now();

    let createdAt = now;
    if (!isNew) {
      const existing = await firstValueFrom(this.storage.get(id));
      if (existing) {
        createdAt = existing.createdAt;
      }
    }

    const doc: CanvasDocument = {
      id,
      name: this.currentDocumentName(),
      createdAt,
      updatedAt: now,
      items: cloneDeep(this.canvasService.items),
    };

    const saved = await firstValueFrom(this.storage.save(doc));

    this.currentDocumentId.set(saved.id);
    this.lastSavedSnapshot.set(JSON.stringify(saved.items));
    this.persistCurrentDocumentId(saved.id);

    return saved;
  }

  /**
   * Save with a new name (Save As).
   * Creates a new document even if current document was already saved.
   */
  async saveAs(name: string): Promise<CanvasDocument> {
    const id = this.storage.generateId();
    const now = Date.now();

    const doc: CanvasDocument = {
      id,
      name,
      createdAt: now,
      updatedAt: now,
      items: cloneDeep(this.canvasService.items),
    };

    const saved = await firstValueFrom(this.storage.save(doc));

    this.currentDocumentId.set(saved.id);
    this.currentDocumentName.set(saved.name);
    this.lastSavedSnapshot.set(JSON.stringify(saved.items));
    this.persistCurrentDocumentId(saved.id);

    return saved;
  }

  /**
   * Rename the current document.
   */
  rename(name: string): void {
    this.currentDocumentName.set(name);
  }

  /**
   * Delete a document by ID.
   * If deleting the current document, creates a new blank one.
   */
  async deleteDocument(id: string): Promise<void> {
    await firstValueFrom(this.storage.delete(id));

    if (this.currentDocumentId() === id) {
      this.newDocument();
    }
  }

  /**
   * Rename a document by ID.
   */
  async renameDocument(id: string, name: string): Promise<void> {
    const doc = await firstValueFrom(this.storage.get(id));
    if (!doc) {
      return;
    }

    doc.name = name;
    await firstValueFrom(this.storage.save(doc));

    // Update current name if renaming current document
    if (this.currentDocumentId() === id) {
      this.currentDocumentName.set(name);
    }
  }

  /**
   * Generate next "Untitled X" name.
   */
  private generateUntitledName(): string {
    const counter = this.untitledCounter();
    this.untitledCounter.set(counter + 1);
    this.localStorageService.setItem(UNTITLED_COUNTER_KEY, counter + 1);
    return `Untitled ${counter}`;
  }

  /**
   * Load persisted state from localStorage.
   */
  private loadPersistedState(): void {
    const counter = this.localStorageService.getItem<number>(
      UNTITLED_COUNTER_KEY,
      1,
    );
    this.untitledCounter.set(counter ?? 1);
  }

  /**
   * Restore the last opened document on app load.
   */
  private async restoreLastDocument(): Promise<void> {
    const docId =
      this.localStorageService.getItem<string>(CURRENT_DOCUMENT_KEY);
    if (docId) {
      const success = await this.openDocument(docId);
      if (!success) {
        // Document was deleted, clear the reference
        this.clearPersistedDocumentId();
      }
    }
  }

  private persistCurrentDocumentId(id: string): void {
    this.localStorageService.setItem(CURRENT_DOCUMENT_KEY, id);
  }

  private clearPersistedDocumentId(): void {
    this.localStorageService.removeItem(CURRENT_DOCUMENT_KEY);
  }
}
