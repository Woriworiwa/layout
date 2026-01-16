import { Injectable } from '@angular/core';

/**
 * Centralized service for managing localStorage operations.
 * Provides type-safe methods for storing and retrieving data with error handling.
 */
@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  /**
   * Get an item from localStorage and parse it as JSON.
   * @param key - The storage key
   * @param defaultValue - Optional default value if key doesn't exist or parsing fails
   * @returns The parsed value or default value
   */
  getItem<T>(key: string, defaultValue?: T): T | null {
    try {
      const item = localStorage.getItem(key);
      if (item === null) {
        return defaultValue !== undefined ? defaultValue : null;
      }
      return JSON.parse(item) as T;
    } catch (error) {
      console.warn(`Failed to get item from localStorage (key: ${key}):`, error);
      return defaultValue !== undefined ? defaultValue : null;
    }
  }

  /**
   * Set an item in localStorage by stringifying it as JSON.
   * @param key - The storage key
   * @param value - The value to store
   */
  setItem<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.warn(`Failed to set item in localStorage (key: ${key}):`, error);
    }
  }

  /**
   * Remove an item from localStorage.
   * @param key - The storage key
   */
  removeItem(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.warn(`Failed to remove item from localStorage (key: ${key}):`, error);
    }
  }

  /**
   * Clear all items from localStorage.
   */
  clear(): void {
    try {
      localStorage.clear();
    } catch (error) {
      console.warn('Failed to clear localStorage:', error);
    }
  }

  /**
   * Get a nested property from an object stored in localStorage.
   * @param key - The storage key
   * @param propertyPath - The property path (e.g., 'user.name')
   * @param defaultValue - Optional default value if property doesn't exist
   * @returns The property value or default value
   */
  getProperty<T>(key: string, propertyPath: string, defaultValue?: T): T | null {
    const obj = this.getItem<Record<string, any>>(key);
    if (!obj) {
      return defaultValue !== undefined ? defaultValue : null;
    }

    const value = propertyPath.split('.').reduce((acc, part) => acc?.[part], obj);
    return value !== undefined ? (value as T) : defaultValue !== undefined ? defaultValue : null;
  }

  /**
   * Set a nested property in an object stored in localStorage.
   * @param key - The storage key
   * @param propertyPath - The property path (e.g., 'user.name')
   * @param value - The value to set
   */
  setProperty<T>(key: string, propertyPath: string, value: T): void {
    const obj = this.getItem<Record<string, any>>(key, {});
    const parts = propertyPath.split('.');
    const lastPart = parts.pop()!;

    let current = obj as any;
    for (const part of parts) {
      if (!(part in current)) {
        current[part] = {};
      }
      current = current[part];
    }

    current[lastPart] = value;
    this.setItem(key, obj);
  }

  /**
   * Check if a key exists in localStorage.
   * @param key - The storage key
   * @returns True if the key exists, false otherwise
   */
  hasItem(key: string): boolean {
    try {
      return localStorage.getItem(key) !== null;
    } catch {
      return false;
    }
  }

  /**
   * Get all keys from localStorage.
   * @returns Array of all storage keys
   */
  getAllKeys(): string[] {
    try {
      return Object.keys(localStorage);
    } catch {
      return [];
    }
  }

  /**
   * Get the number of items in localStorage.
   * @returns The number of items
   */
  getLength(): number {
    try {
      return localStorage.length;
    } catch {
      return 0;
    }
  }
}
