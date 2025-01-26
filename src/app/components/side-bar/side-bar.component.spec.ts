import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SideBarComponent } from './side-bar.component';
import {SelectionService} from "../../services/selection.service";
import {ContextMenuService} from "../../services/context-menu.service";
import {DragDropService} from "../../services/drag-drop.service";
import {CanvasService} from "../../services/canvas.service";
import {UndoRedoService} from "../../services/undo-redo.service";
import {PresetsService} from "../../services/presets.service";

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
