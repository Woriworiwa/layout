import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Document, DocumentListItem } from '@layout/models';
import { DocumentStorage } from '@layout/shared';
import { LocalStorageService } from './local-storage.service';

const DOCUMENTS_INDEX_KEY = 'DOCUMENTS_INDEX';
const DOCUMENT_PREFIX = 'DOCUMENT_';

/**
 * LocalStorage implementation of DocumentStorage.
 * Stores documents in browser localStorage with an index for fast listing.
 *
 * Storage structure:
 * - DOCUMENTS_INDEX: Array of DocumentListItem (metadata only)
 * - DOCUMENT_{id}: Full Document object for each document
 */
@Injectable()
export class LocalStorageDocumentStorage<T = unknown>
  implements DocumentStorage<T>
{
  private localStorageService = inject(LocalStorageService);

  list(): Observable<DocumentListItem[]> {
    const index =
      this.localStorageService.getItem<DocumentListItem[]>(
        DOCUMENTS_INDEX_KEY,
        []
      ) ?? [];
    return of(index);
  }

  get(id: string): Observable<Document<T> | null> {
    const doc = this.localStorageService.getItem<Document<T>>(
      `${DOCUMENT_PREFIX}${id}`
    );
    return of(doc);
  }

  save(doc: Document<T>): Observable<Document<T>> {
    // Update timestamp
    doc.updatedAt = Date.now();

    // Save the document
    this.localStorageService.setItem(`${DOCUMENT_PREFIX}${doc.id}`, doc);

    // Update the index
    const index =
      this.localStorageService.getItem<DocumentListItem[]>(
        DOCUMENTS_INDEX_KEY,
        []
      ) ?? [];

    const existingIndex = index.findIndex((d) => d.id === doc.id);
    const listItem: DocumentListItem = {
      id: doc.id,
      name: doc.name,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };

    if (existingIndex >= 0) {
      index[existingIndex] = listItem;
    } else {
      index.push(listItem);
    }

    this.localStorageService.setItem(DOCUMENTS_INDEX_KEY, index);
    return of(doc);
  }

  delete(id: string): Observable<void> {
    // Remove the document
    this.localStorageService.removeItem(`${DOCUMENT_PREFIX}${id}`);

    // Update the index
    const index =
      this.localStorageService.getItem<DocumentListItem[]>(
        DOCUMENTS_INDEX_KEY,
        []
      ) ?? [];
    const filtered = index.filter((d) => d.id !== id);
    this.localStorageService.setItem(DOCUMENTS_INDEX_KEY, filtered);

    return of(void 0);
  }

  generateId(): string {
    return crypto.randomUUID();
  }
}
