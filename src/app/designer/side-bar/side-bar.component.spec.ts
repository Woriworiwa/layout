import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SideBarComponent } from './side-bar.component';
import {SelectionService} from "../../shared/canvas/selection/selection.service";
import {ContextMenuService} from "../../shared/canvas/context-menu/context-menu.service";
import {DragDropService} from "../../shared/canvas/drag-drop.service";
import {CanvasService} from "../../shared/canvas/canvas.service";
import {UndoRedoService} from "../../core/undo-redo/undo-redo.service";
import {PresetsService} from "../insert/presets.service";

describe('LeftNavigationComponent', () => {
  let component: SideBarComponent;
  let fixture: ComponentFixture<SideBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SideBarComponent],
      providers: [SelectionService, ContextMenuService, DragDropService, CanvasService, UndoRedoService, PresetsService]
    }).compileComponents();

    fixture = TestBed.createComponent(SideBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
