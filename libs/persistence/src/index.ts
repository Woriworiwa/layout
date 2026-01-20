// Re-export from @layout/models for convenience
export type {
  Document,
  DocumentMetadata,
  DocumentListItem,
} from '@layout/models';

// Re-export from @layout/shared for convenience
export { DOCUMENT_STORAGE } from '@layout/shared';
export type { DocumentStorage } from '@layout/shared';

// Storage implementations
export * from './lib/local-storage-document.storage';
export * from './lib/local-storage.service';

// Providers
export * from './lib/persistence-providers';
