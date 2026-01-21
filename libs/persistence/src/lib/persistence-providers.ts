import { Provider } from '@angular/core';
import { DOCUMENT_STORAGE } from '@layout/shared';
import { LocalStorageDocumentStorage } from './local-storage-document.storage';
import { LocalStorageService } from './local-storage.service';

/**
 * Provides the default persistence services using localStorage.
 * Use this in your app.config.ts providers array.
 *
 * @example
 * ```typescript
 * export const appConfig: ApplicationConfig = {
 *   providers: [
 *     ...providePersistence(),
 *   ],
 * };
 * ```
 */
export function providePersistence(): Provider[] {
  return [
    { provide: DOCUMENT_STORAGE, useClass: LocalStorageDocumentStorage },
    LocalStorageService
  ];
}
