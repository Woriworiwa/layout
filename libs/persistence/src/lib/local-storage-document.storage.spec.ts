import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { firstValueFrom } from 'rxjs';
import { LocalStorageDocumentStorage } from './local-storage-document.storage';
import { LocalStorageService } from './local-storage.service';
import { Document, DocumentListItem } from '@layout/models';

describe('LocalStorageDocumentStorage', () => {
  let storage: LocalStorageDocumentStorage<unknown>;
  let localStorageService: LocalStorageService;
  let mockData: Record<string, unknown>;

  beforeEach(() => {
    mockData = {};

    TestBed.configureTestingModule({
      providers: [LocalStorageDocumentStorage, LocalStorageService],
    });

    localStorageService = TestBed.inject(LocalStorageService);
    storage = TestBed.inject(LocalStorageDocumentStorage);

    // Mock LocalStorageService methods
    vi.spyOn(localStorageService, 'getItem').mockImplementation(
      <T>(key: string, defaultValue?: T) => {
        const value = mockData[key];
        return value !== undefined ? (value as T) : defaultValue ?? null;
      }
    );

    vi.spyOn(localStorageService, 'setItem').mockImplementation(
      <T>(key: string, value: T) => {
        mockData[key] = value;
      }
    );

    vi.spyOn(localStorageService, 'removeItem').mockImplementation(
      (key: string) => {
        delete mockData[key];
      }
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('list', () => {
    describe('WHEN listing documents with empty storage', () => {
      it('SHOULD return empty array', async () => {
        const result = await firstValueFrom(storage.list());

        expect(result).toEqual([]);
      });
    });

    describe('WHEN listing documents', () => {
      it('SHOULD return index metadata', async () => {
        const mockIndex: DocumentListItem[] = [
          {
            id: 'doc1',
            name: 'Test Document',
            createdAt: 1704067200000,
            updatedAt: 1704153600000,
          },
          {
            id: 'doc2',
            name: 'Another Document',
            createdAt: 1704240000000,
            updatedAt: 1704326400000,
          },
        ];
        mockData['DOCUMENTS_INDEX'] = mockIndex;

        const result = await firstValueFrom(storage.list());

        expect(result).toHaveLength(2);
        expect(result[0].id).toBe('doc1');
        expect(result[1].id).toBe('doc2');
      });
    });
  });

  describe('get', () => {
    describe('WHEN getting existing document', () => {
      it('SHOULD return full document', async () => {
        const mockDoc: Document = {
          id: 'doc1',
          name: 'Test Document',
          items: [],
          createdAt: 1704067200000,
          updatedAt: 1704153600000,
        };
        mockData['DOCUMENT_doc1'] = mockDoc;

        const result = await firstValueFrom(storage.get('doc1'));

        expect(result).toBeTruthy();
        expect(result?.id).toBe('doc1');
        expect(result?.name).toBe('Test Document');
      });
    });

    describe('WHEN getting non-existent document', () => {
      it('SHOULD return null', async () => {
        const result = await firstValueFrom(storage.get('nonExistent'));

        expect(result).toBeNull();
      });
    });
  });

  describe('save', () => {
    describe('WHEN saving new document', () => {
      it('SHOULD add to storage and index', async () => {
        const newDoc: Document = {
          id: 'new-doc',
          name: 'New Document',
          items: [],
          createdAt: 1704067200000,
          updatedAt: 1704067200000,
        };

        await firstValueFrom(storage.save(newDoc));

        const storedDoc = mockData['DOCUMENT_new-doc'] as Document;
        expect(storedDoc.id).toBe('new-doc');

        const index = mockData['DOCUMENTS_INDEX'] as DocumentListItem[];
        expect(index).toHaveLength(1);
        expect(index[0].id).toBe('new-doc');
      });

      it('SHOULD update the updatedAt timestamp', async () => {
        const originalTime = 1704067200000;
        const doc: Document = {
          id: 'doc1',
          name: 'Test Doc',
          items: [],
          createdAt: originalTime,
          updatedAt: originalTime,
        };

        const savedDoc = await firstValueFrom(storage.save(doc));

        expect(savedDoc.updatedAt).toBeGreaterThan(originalTime);
      });
    });

    describe('WHEN saving existing document', () => {
      it('SHOULD update storage and index', async () => {
        const originalDoc: Document = {
          id: 'existing-doc',
          name: 'Original Name',
          items: [],
          createdAt: 1704067200000,
          updatedAt: 1704067200000,
        };

        await firstValueFrom(storage.save(originalDoc));

        const updatedDoc: Document = {
          ...originalDoc,
          name: 'Updated Name',
        };
        await firstValueFrom(storage.save(updatedDoc));

        const storedDoc = mockData['DOCUMENT_existing-doc'] as Document;
        expect(storedDoc.name).toBe('Updated Name');

        const index = mockData['DOCUMENTS_INDEX'] as DocumentListItem[];
        expect(index).toHaveLength(1);
        expect(index[0].name).toBe('Updated Name');
      });
    });

    describe('WHEN saving document with items', () => {
      it('SHOULD preserve items in storage', async () => {
        const doc: Document<{ key: string }> = {
          id: 'doc-with-items',
          name: 'Document with Items',
          items: [{ key: 'item-1' }, { key: 'item-2' }],
          createdAt: 1704067200000,
          updatedAt: 1704067200000,
        };

        await firstValueFrom(storage.save(doc));

        const storedDoc = mockData['DOCUMENT_doc-with-items'] as Document<{
          key: string;
        }>;
        expect(storedDoc.items).toHaveLength(2);
        expect(storedDoc.items[0].key).toBe('item-1');
      });
    });
  });

  describe('delete', () => {
    describe('WHEN deleting document', () => {
      it('SHOULD remove from storage and index', async () => {
        const doc: Document = {
          id: 'to-delete',
          name: 'Delete Me',
          items: [],
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        await firstValueFrom(storage.save(doc));

        await firstValueFrom(storage.delete('to-delete'));

        expect(mockData['DOCUMENT_to-delete']).toBeUndefined();

        const index = mockData['DOCUMENTS_INDEX'] as DocumentListItem[];
        expect(index).toHaveLength(0);
      });
    });

    describe('WHEN deleting non-existent document', () => {
      it('SHOULD handle gracefully', async () => {
        await expect(
          firstValueFrom(storage.delete('nonExistent'))
        ).resolves.not.toThrow();

        const index = mockData['DOCUMENTS_INDEX'] as
          | DocumentListItem[]
          | undefined;
        expect(index ?? []).toEqual([]);
      });
    });

    describe('WHEN deleting one of multiple documents', () => {
      it('SHOULD only remove the specified document', async () => {
        const doc1: Document = {
          id: 'doc1',
          name: 'Doc 1',
          items: [],
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        const doc2: Document = {
          id: 'doc2',
          name: 'Doc 2',
          items: [],
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        await firstValueFrom(storage.save(doc1));
        await firstValueFrom(storage.save(doc2));

        await firstValueFrom(storage.delete('doc1'));

        expect(mockData['DOCUMENT_doc1']).toBeUndefined();
        expect(mockData['DOCUMENT_doc2']).toBeDefined();

        const index = mockData['DOCUMENTS_INDEX'] as DocumentListItem[];
        expect(index).toHaveLength(1);
        expect(index[0].id).toBe('doc2');
      });
    });
  });

  describe('generateId', () => {
    describe('WHEN generating ID', () => {
      it('SHOULD return valid UUID format', () => {
        const id = storage.generateId();

        const uuidRegex =
          /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        expect(id).toMatch(uuidRegex);
      });

      it('SHOULD generate unique IDs', () => {
        const id1 = storage.generateId();
        const id2 = storage.generateId();

        expect(id1).not.toBe(id2);
      });
    });
  });
});
