import {TestBed} from '@angular/core/testing';
import {CanvasService} from './canvas.service';
import {CanvasStore} from '../core/store/canvas.store';
import {UndoRedoService} from '../core/undo-redo/undo-redo.service';
import {SelectionService} from './selection/selection.service';
import {AssetService} from '../designer/assets/asset.service';
import {DragDropService} from './drag-drop.service';
import {CanvasItem} from '../core/models/canvas-item.model';
import {CanvasItemType, InsertPosition} from '../core/enums';
import {ContextMenuService} from "./context-menu/context-menu.service";
import spyOn = jest.spyOn;

import {Css} from "../core/models/css/css";

describe('CanvasService', () => {
  let service: CanvasService;
  let canvasStore: CanvasStore;
  let undoRedoService: jest.Mocked<UndoRedoService>;
  let selectionService: jest.Mocked<SelectionService>;
  let presetsService: jest.Mocked<AssetService>;
  let dragDropService: jest.Mocked<DragDropService>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CanvasService,
        CanvasStore,
        UndoRedoService,
        SelectionService,
        AssetService,
        DragDropService,
        ContextMenuService
      ],
    });

    service = TestBed.inject(CanvasService);
    canvasStore = TestBed.inject(CanvasStore);
    undoRedoService = TestBed.inject(UndoRedoService) as jest.Mocked<UndoRedoService>;
    selectionService = TestBed.inject(SelectionService) as jest.Mocked<SelectionService>;
    presetsService = TestBed.inject(AssetService) as jest.Mocked<AssetService>;
    dragDropService = TestBed.inject(DragDropService) as jest.Mocked<DragDropService>;

    spyOn(undoRedoService, 'takeSnapshot');
    spyOn(selectionService, 'setSelectedItemKey');
    spyOn(selectionService, 'setHoverItemKey');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set items and take snapshot', () => {
    const items: CanvasItem[] = [];
    service.setItems(items);
    expect(canvasStore.items).toEqual(items);
    expect(undoRedoService.takeSnapshot).toHaveBeenCalled();
  });

  it('should insert item and take snapshot', () => {

    const newItem: CanvasItem = {key: '1', itemType: CanvasItemType.TEXT, css: {}, children: []};
    service.insertItem('0', newItem, InsertPosition.AFTER);
    expect(canvasStore.items).toContainEqual(newItem);
    expect(selectionService.setSelectedItemKey).toHaveBeenCalledWith(newItem.key);
    expect(undoRedoService.takeSnapshot).toHaveBeenCalled();
  });

  it('should delete item and update selection', () => {
    const item: CanvasItem = {key: '1', itemType: CanvasItemType.TEXT, css: {}, children: []};
    canvasStore.setItems([item]);
    service.deleteItem('1');
    expect(canvasStore.items).not.toContain(item);
    expect(selectionService.setSelectedItemKey).toHaveBeenCalledWith(undefined);
    expect(selectionService.setHoverItemKey).toHaveBeenCalledWith(undefined);
  });

  it('should update CSS and take snapshot', () => {
    const item: CanvasItem = {key: '1', itemType: CanvasItemType.TEXT, css: {}, children: []};
    Object.defineProperty(selectionService, 'selectedItem', {value: item, writable: true});
    const newCss: Css = {display: {display: 'block'}}; // Use valid Css properties
    service.updateCss(newCss);
    expect(item.css).toEqual(newCss);
    expect(undoRedoService.takeSnapshot).toHaveBeenCalled();
  });

  it('should move item child and update items', () => {
    const parentItem: CanvasItem = {
      key: '0',
      itemType: CanvasItemType.TEXT,
      css: {},
      children: [{key: '1', itemType: CanvasItemType.TEXT, css: {}, children: []}]
    };
    canvasStore.setItems([parentItem]);
    service.moveItemChild('0', '0', 0, 1);
    expect(canvasStore.items).toEqual([parentItem]);
  });

  it('should update text content and take snapshot', () => {
    const item: CanvasItem = {key: '1', itemType: CanvasItemType.TEXT, css: {}, children: [], content: 'old'};
    canvasStore.setItems([item]);
    service.updateTextContent('1', 'new');
    expect(item.content).toBe('new');
    expect(undoRedoService.takeSnapshot).toHaveBeenCalled();
  });

  it('should rename item and take snapshot', () => {
    const item: CanvasItem = {key: '1', itemType: CanvasItemType.TEXT, css: {}, children: [], label: 'old'};
    canvasStore.setItems([item]);
    service.renameItem('new', '1');
    expect(item.label).toBe('new');
    expect(undoRedoService.takeSnapshot).toHaveBeenCalled();
  });

  it('should paste item and insert duplicated item', () => {
    const item: CanvasItem = {key: '1', itemType: CanvasItemType.TEXT, css: {}, children: []};
    canvasStore.setItems([item]);
    service.pasteItem('1', '2');
    expect(canvasStore.items.length).toBe(2);
    expect(undoRedoService.takeSnapshot).toHaveBeenCalled();
  });
});
