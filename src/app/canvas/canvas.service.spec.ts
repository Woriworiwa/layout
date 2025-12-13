import {TestBed} from '@angular/core/testing';
import {CanvasService} from './canvas.service';
import {CanvasStore} from './canvas.store';
import {UndoRedoService} from '../core/undo-redo/undo-redo.service';
import {SelectionService} from './selection/selection.service';
import {PresetService} from '../designer/presets/preset.service';
import {DragDropService} from './drag-drop/drag-drop.service';
import {CanvasItem} from '../core/models/canvas-item.model';
import {CanvasItemType, InsertPosition} from '../core/enums';
import {ContextMenuService} from "./context-menu/context-menu.service";
import { vi } from 'vitest';

import {Css} from "../core/models/css/css";
import { PanZoomService } from './pan-zoom/pan-zoom.service';
import { Renderer2 } from '@angular/core';

describe('CanvasService', () => {
  let service: CanvasService;
  let canvasStore: CanvasStore;
  let undoRedoService: UndoRedoService;
  let selectionService: SelectionService;
  let presetsService: PresetService;
  let dragDropService: DragDropService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CanvasService,
        CanvasStore,
        UndoRedoService,
        SelectionService,
        PanZoomService,
        Renderer2,
        PresetService,
        DragDropService,
        ContextMenuService
      ],
    });

    service = TestBed.inject(CanvasService);
    canvasStore = TestBed.inject(CanvasStore);
    undoRedoService = TestBed.inject(UndoRedoService);
    selectionService = TestBed.inject(SelectionService);
    presetsService = TestBed.inject(PresetService);
    dragDropService = TestBed.inject(DragDropService);

    vi.spyOn(undoRedoService, 'takeSnapshot');
    vi.spyOn(selectionService, 'setSelectedItemKey');
    vi.spyOn(selectionService, 'setHoverItemKey');
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
    canvasStore.setItems([item]);
    Object.defineProperty(selectionService, 'selectedItem', {value: item, writable: true});
    const newCss: Css = {display: {display: 'block'}}; // Use valid Css properties
    service.updateCss(newCss);
    expect(canvasStore.items[0].css).toEqual(newCss);
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
    expect(canvasStore.items[0].content).toBe('new');
    expect(undoRedoService.takeSnapshot).toHaveBeenCalled();
  });

  it('should rename item and take snapshot', () => {
    const item: CanvasItem = {key: '1', itemType: CanvasItemType.TEXT, css: {}, children: [], label: 'old'};
    canvasStore.setItems([item]);
    service.renameItem('new', '1');
    expect(canvasStore.items[0].label).toBe('new');
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
