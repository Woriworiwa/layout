import {Component, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges} from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule} from "@angular/forms";
import {Tooltip} from "primeng/tooltip";
import {Button} from "primeng/button";
import {AppStateService} from "../../core/services/app-state.service";
import {SideBarPrimary} from "../../core/enums";
import {CanvasService} from "../canvas/canvas.service";
import {SelectionService} from "../canvas/selection/selection.service";
import {Subject, takeUntil} from "rxjs";
import {CanvasItem} from "../../core/models/canvas-item.model";

@Component({
  selector: 'app-side-bar',
  imports: [CommonModule, FormsModule, Tooltip, Button],
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.scss',
})
export class SideBarComponent implements OnDestroy, OnChanges {
  @Input()
  tabs: any;

  selectedPrimary: SideBarPrimary | undefined;

  @Output()
  selectedItemChange: EventEmitter<any> = new EventEmitter<any>();

  private destroy$ = new Subject();
  frame: CanvasItem | undefined;

  constructor(protected appStateService: AppStateService,
              protected selectionService: SelectionService,
              protected canvasService: CanvasService) {
    this.selectionService.hoverItem$
      .pipe(takeUntil(this.destroy$))
      .subscribe(frame => {
        this.frame = frame;
      });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['tabs'] && !this.selectedPrimary) {
      const tab = this.tabs[0];
      this.selectedPrimary = tab.tab;
      // this.selectedItemChange.emit(tab);
    }
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  toggleDarkMode() {
    this.appStateService.appState.update((state) => ({ ...state, darkTheme: !state.darkTheme }));
  }

  onClick(tab: any): void {
    this.selectedPrimary = tab.tab;
    this.selectedItemChange.emit(tab);
  }
}




