import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { Document, DocumentListItem } from '@layout/models';

/**
 * Abstract storage interface for document persistence.
 * Implement this interface to support different storage backends
 * (localStorage, IndexedDB, REST API, etc.)
 *
 * Generic type T represents the content item type stored in documents.
 */
export interface DocumentStorage<T = unknown> {
  /**
   * Get a list of all documents (metadata only, no items).
   */
  list(): Observable<DocumentListItem[]>;

  /**
   * Get a document by ID including its content items.
   * Returns null if not found.
   */
  get(id: string): Observable<Document<T> | null>;

  /**
   * Save a document (create or update).
   * Returns the saved document with updated timestamps.
   */
  save(doc: Document<T>): Observable<Document<T>>;

  /**
   * Delete a document by ID.
   */
  delete(id: string): Observable<void>;

  /**
   * Generate a unique document ID.
   */
  generateId(): string;
}

/**
 * Injection token for the document storage implementation.
 * Allows swapping storage backends without changing dependent code.
 *
 * @example
 * ```typescript
 * // In your app providers
 * providers: [
 *   { provide: DOCUMENT_STORAGE, useClass: LocalStorageDocumentStorage }
 * ]
 * ```
 */
export const DOCUMENT_STORAGE = new InjectionToken<DocumentStorage>(
  'DocumentStorage'
);
