import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { LocalStorageService } from './local-storage.service';

describe('LocalStorageService', () => {
  let service: LocalStorageService;
  let mockStorage: Record<string, string>;

  beforeEach(() => {
    mockStorage = {};

    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(
      (key: string) => mockStorage[key] ?? null
    );

    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(
      (key: string, value: string) => {
        mockStorage[key] = value;
      }
    );

    vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(
      (key: string) => {
        delete mockStorage[key];
      }
    );

    vi.spyOn(Storage.prototype, 'clear').mockImplementation(() => {
      mockStorage = {};
    });

    vi.spyOn(Object, 'keys').mockImplementation((obj: object) => {
      if (obj === localStorage) {
        return Object.getOwnPropertyNames(mockStorage);
      }
      return Object.getOwnPropertyNames(obj);
    });

    Object.defineProperty(Storage.prototype, 'length', {
      get: () => Object.getOwnPropertyNames(mockStorage).length,
      configurable: true,
    });

    TestBed.configureTestingModule({
      providers: [LocalStorageService],
    });

    service = TestBed.inject(LocalStorageService);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('getItem', () => {
    describe('WHEN getting an existing item', () => {
      it('SHOULD return parsed value', () => {
        mockStorage['testKey'] = JSON.stringify({ name: 'Test' });

        const result = service.getItem<{ name: string }>('testKey');

        expect(result).toEqual({ name: 'Test' });
      });
    });

    describe('WHEN getting a non-existent item', () => {
      it('SHOULD return null when no default provided', () => {
        const result = service.getItem('nonExistent');

        expect(result).toBeNull();
      });

      it('SHOULD return default value when provided', () => {
        const defaultValue = { fallback: true };

        const result = service.getItem('nonExistent', defaultValue);

        expect(result).toEqual(defaultValue);
      });
    });

    describe('WHEN getting invalid JSON', () => {
      it('SHOULD return null when no default provided', () => {
        mockStorage['invalidJson'] = '{invalid json}';

        const result = service.getItem('invalidJson');

        expect(result).toBeNull();
      });

      it('SHOULD return default value when provided', () => {
        mockStorage['invalidJson'] = '{invalid json}';
        const defaultValue = { safe: true };

        const result = service.getItem('invalidJson', defaultValue);

        expect(result).toEqual(defaultValue);
      });
    });
  });

  describe('setItem', () => {
    describe('WHEN setting an item', () => {
      it('SHOULD store JSON string in localStorage', () => {
        const value = { id: 1, name: 'Test Item' };

        service.setItem('testKey', value);

        expect(mockStorage['testKey']).toBe(JSON.stringify(value));
      });
    });
  });

  describe('removeItem', () => {
    describe('WHEN removing an item', () => {
      it('SHOULD delete from localStorage', () => {
        mockStorage['toRemove'] = JSON.stringify({ data: 'test' });

        service.removeItem('toRemove');

        expect(mockStorage['toRemove']).toBeUndefined();
      });
    });
  });

  describe('clear', () => {
    describe('WHEN clearing storage', () => {
      it('SHOULD remove all items', () => {
        mockStorage['key1'] = 'value1';
        mockStorage['key2'] = 'value2';

        service.clear();

        expect(Object.keys(mockStorage).length).toBe(0);
      });
    });
  });

  describe('hasItem', () => {
    describe('WHEN checking if item exists', () => {
      it('SHOULD return true for existing key', () => {
        mockStorage['existingKey'] = 'value';

        expect(service.hasItem('existingKey')).toBe(true);
      });

      it('SHOULD return false for non-existent key', () => {
        expect(service.hasItem('nonExistentKey')).toBe(false);
      });
    });
  });

  describe('getAllKeys', () => {
    describe('WHEN getting all keys', () => {
      it('SHOULD return array of storage keys', () => {
        mockStorage['key1'] = 'value1';
        mockStorage['key2'] = 'value2';
        mockStorage['key3'] = 'value3';

        const keys = service.getAllKeys();

        expect(keys).toContain('key1');
        expect(keys).toContain('key2');
        expect(keys).toContain('key3');
        expect(keys).toHaveLength(3);
      });

      it('SHOULD return empty array when storage is empty', () => {
        const keys = service.getAllKeys();

        expect(keys).toEqual([]);
      });
    });
  });

  describe('getLength', () => {
    describe('WHEN getting storage length', () => {
      it('SHOULD return number of items', () => {
        mockStorage['key1'] = 'value1';
        mockStorage['key2'] = 'value2';

        expect(service.getLength()).toBe(2);
      });
    });
  });

  describe('getProperty', () => {
    describe('WHEN getting nested property', () => {
      it('SHOULD traverse object path and return value', () => {
        const data = {
          user: {
            profile: {
              name: 'John Doe',
            },
          },
        };
        mockStorage['userData'] = JSON.stringify(data);

        const result = service.getProperty('userData', 'user.profile.name');

        expect(result).toBe('John Doe');
      });

      it('SHOULD return default value when path does not exist', () => {
        mockStorage['userData'] = JSON.stringify({ user: {} });

        const result = service.getProperty(
          'userData',
          'user.profile.name',
          'Unknown'
        );

        expect(result).toBe('Unknown');
      });

      it('SHOULD return null when key does not exist and no default', () => {
        const result = service.getProperty('nonExistent', 'some.path');

        expect(result).toBeNull();
      });
    });
  });

  describe('setProperty', () => {
    describe('WHEN setting nested property', () => {
      it('SHOULD create intermediate objects and set value', () => {
        mockStorage['config'] = JSON.stringify({});

        service.setProperty('config', 'theme.colors.primary', '#007bff');

        const stored = JSON.parse(mockStorage['config']);
        expect(stored.theme.colors.primary).toBe('#007bff');
      });

      it('SHOULD update existing nested property', () => {
        mockStorage['settings'] = JSON.stringify({
          app: { version: '1.0.0' },
        });

        service.setProperty('settings', 'app.version', '2.0.0');

        const stored = JSON.parse(mockStorage['settings']);
        expect(stored.app.version).toBe('2.0.0');
      });

      it('SHOULD create new object when key does not exist', () => {
        service.setProperty('newConfig', 'feature.enabled', true);

        const stored = JSON.parse(mockStorage['newConfig']);
        expect(stored.feature.enabled).toBe(true);
      });

      it('SHOULD do nothing when property path is empty', () => {
        mockStorage['config'] = JSON.stringify({ existing: true });

        service.setProperty('config', '', 'value');

        const stored = JSON.parse(mockStorage['config']);
        expect(stored).toEqual({ existing: true });
      });
    });
  });
});
