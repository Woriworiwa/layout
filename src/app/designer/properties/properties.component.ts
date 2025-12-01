import { Component, ElementRef, HostListener, inject, input, viewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { ButtonDirective } from 'primeng/button';
import { InputGroup } from 'primeng/inputgroup';
import { InputText } from 'primeng/inputtext';
import { SelectionService } from '../../canvas/selection/selection.service';
import { CanvasItemType } from '../../core/enums';
import { CanvasItem } from '../../core/models/canvas-item.model';
import { BoxSizingComponent } from './groups/box-sizing.component';
import { DisplayComponent } from './groups/display.component';
import { MetaDataComponent } from './groups/meta-data.component';
import { PropertiesFlexContainerComponent } from './groups/flex-container.component';
import { PropertiesFlexItemComponent } from './groups/flex-item.component';
import { PropertiesConfig } from './properties.config';

@Component({
  selector: 'app-settings',
  imports: [
    FormsModule,
    ButtonDirective,
    InputGroup,
    InputText,
    BoxSizingComponent,
    DisplayComponent,
    MetaDataComponent,
    PropertiesFlexContainerComponent,
    PropertiesFlexItemComponent,
  ],
  templateUrl: './properties.component.html',
  styleUrls: ['./properties.component.scss']
})
export class PropertiesComponent {
  private readonly selectionService = inject(SelectionService);

  config = input<PropertiesConfig>({});

  protected readonly searchInput = viewChild<ElementRef<HTMLInputElement>>('searchInput');
  protected readonly FrameType = CanvasItemType;
  protected readonly searchPlaceholder = this.detectPlatform();

  protected frame: CanvasItem | undefined;
  protected searchText = '';

  constructor() {
    this.selectionService.selectedItem$
      .pipe(takeUntilDestroyed())
      .subscribe(frame => {
        this.frame = frame;
      });
  }

  @HostListener('window:keydown', ['$event'])
  protected handleKeyboardShortcut(event: KeyboardEvent): void {
    const isSearchShortcut = (event.ctrlKey || event.metaKey) && event.key === 'k';

    if (isSearchShortcut) {
      event.preventDefault();
      this.focusSearchInput();
    }
  }

  private detectPlatform(): string {
    const isMac = /Mac|iPhone|iPad|iPod/.test(navigator.userAgent);
    return isMac ? 'Search (⌘K)' : 'Search (Ctrl+K)';
  }

  private focusSearchInput(): void {
    const input = this.searchInput();

    if (input) {
      input.nativeElement.focus();
      input.nativeElement.select();
    }
  }
}
