import {ChangeDetectionStrategy, ChangeDetectorRef, Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, ReactiveFormsModule} from "@angular/forms";
import {Frame} from "../../models/frame.model";
import {SettingsFlex} from "./settings.flex";
import {PropertyPanelRowComponent} from "./property-panel-row.component";
import {SelectButtonModule} from "primeng/selectbutton";
import {Subject, takeUntil} from "rxjs";
import {CanvasStore} from "../../store/canvas.store";
import { FrameType } from '../../models/enums';
import {ThemeService} from "../../services/theme.service";
import {ThemeOptionsComponent} from "../header/theme-options.component";

@Component({
  selector: 'app-settings',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ReactiveFormsModule, SettingsFlex, PropertyPanelRowComponent, SelectButtonModule, ThemeOptionsComponent],
  template: `
    @switch (frame?.frameType) {
      @case (FrameType.FLEX) {
        <app-settings-flex [flexLayoutSettings]="frame?.flexLayoutSettings"></app-settings-flex>
      }
      @case (FrameType.GRID) {

      }
    }

  `,
  styles: `
    :host {
      display: grid;
      grid-template-columns: min-content 1fr;
      flex-direction: row;
      gap: 5px;
    }
  `
})
export class SettingsComponent {
  frame: Frame | undefined;

  frameTypeOptions = [
    {label: 'Flex', value: FrameType.FLEX},
    {label: 'Grid', value: FrameType.GRID}
  ]

  formGroup = this.fb.group({
    frameType: [FrameType.FLEX],
  });

  private destroy$ = new Subject();

  constructor(public fb: FormBuilder,
              private cd: ChangeDetectorRef,
              protected canvasStore: CanvasStore,
              private themeService: ThemeService) {
    this.canvasStore.selectedFrame$
      .subscribe(frame => {
        this.frame = frame;
        this.cd.markForCheck();
    })
  }

  ngOnInit() {
    if (this.frame){
      this.formGroup.patchValue(this.frame)
    }

    this.formGroup.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((value: any) => {
          // this.canvasStore.updateFlexLayoutSettings(value);
      });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  switchTheme(themeName: string) {
    this.themeService.changeTheme();
  }

  protected readonly FrameType = FrameType;
}
