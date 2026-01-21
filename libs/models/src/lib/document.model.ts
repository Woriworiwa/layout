/**
 * Lightweight document metadata for listing documents.
 * Does not include the actual content to keep list operations fast.
 */
export interface DocumentMetadata {
  id: string;
  name: string;
  createdAt: number;
  updatedAt: number;
}

/**
 * Full document including content.
 * Generic type T allows different apps to store different content types.
 */
export interface Document<T = unknown> extends DocumentMetadata {
  items: T[];
}

/**
 * Alias for DocumentMetadata used in list operations.
 */
export type DocumentListItem = DocumentMetadata;
