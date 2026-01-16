import { InjectionToken } from '@angular/core';

/**
 * Interface for local storage service used by components that need to persist state.
 * Implement this in your app's storage service and provide it using LOCAL_STORAGE_SERVICE token.
 */
export interface LocalStorage {
  getProperty<T>(storageKey: string, propertyKey: string): T | null;
  setProperty<T>(storageKey: string, propertyKey: string, value: T): void;
}

/**
 * Injection token for local storage service.
 * Provide this in your app to enable persistence of component states.
 *
 * @example
 * ```typescript
 * // In your app providers
 * providers: [
 *   { provide: LOCAL_STORAGE_SERVICE, useExisting: YourLocalStorageService }
 * ]
 * ```
 */
export const LOCAL_STORAGE_SERVICE = new InjectionToken<LocalStorage>('local-storage.service');
