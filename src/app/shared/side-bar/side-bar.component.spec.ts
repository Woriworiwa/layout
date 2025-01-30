import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SideBarComponent } from './side-bar.component';
import {SelectionService} from "../canvas/selection/selection.service";
import {ContextMenuService} from "../canvas/context-menu/context-menu.service";
import {DragDropService} from "../canvas/drag-drop.service";
import {CanvasService} from "../canvas/canvas.service";
import {UndoRedoService} from "../../core/undo-redo/undo-redo.service";
import {PresetsService} from "../../design/insert/presets.service";

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
