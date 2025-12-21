import {
  Component,
  ElementRef,
  HostListener,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import {
  takeUntilDestroyed,
  toObservable,
  toSignal,
} from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { ButtonDirective } from 'primeng/button';
import { InputGroup } from 'primeng/inputgroup';
import { InputText } from 'primeng/inputtext';
import { merge } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  CanvasService,
  SelectionService,
  CanvasItemType,
} from '@layout/canvas';
import { Display } from '@layout/models';
import { BoxSizingComponent } from './property-groups/box-sizing.component';
import { DisplayComponent } from './property-groups/display.component';
import { MetaDataComponent } from './property-groups/meta-data.component';
import { PropertiesFlexContainerComponent } from './property-groups/flex-container.component';
import { PropertiesFlexItemComponent } from './property-groups/flex-item.component';
import { PropertiesGridContainerComponent } from './property-groups/grid-container.component';
import { PropertiesGridItemComponent } from './property-groups/grid-item.component';
import { PropertiesConfig } from './properties.config';
import { PropertiesService } from './properties.service';
import { CssViewerComponent } from '../../shared/code-viewer/css-viewer.component';

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
    PropertiesGridContainerComponent,
    PropertiesGridItemComponent,
    CssViewerComponent,
  ],
  providers: [PropertiesService],
  templateUrl: './properties.component.html',
  styleUrls: ['./properties.component.scss'],
  host: {
    class: 'min-h-0',
  },
})
export class PropertiesComponent {
  private readonly selectionService = inject(SelectionService);
  private readonly canvasService = inject(CanvasService);

  config = input<PropertiesConfig>({});

  protected readonly searchInput =
    viewChild<ElementRef<HTMLInputElement>>('searchInput');
  protected readonly FrameType = CanvasItemType;
  protected readonly searchPlaceholder = this.detectPlatform();

  protected readonly frame = toSignal(
    merge(
      this.selectionService.selectedItem$,
      this.canvasService.cssChanged$.pipe(
        map(() => this.selectionService.selectedItem),
      ),
    ),
  );

  protected searchText = signal('');
  private readonly propertiesService = inject(PropertiesService);

  constructor() {
    toObservable(this.searchText)
      .pipe(takeUntilDestroyed())
      .subscribe((text) => {
        this.propertiesService.searchText.set(text);
      });
  }

  @HostListener('window:keydown', ['$event'])
  protected handleKeyboardShortcut(event: KeyboardEvent): void {
    const isSearchShortcut =
      (event.ctrlKey || event.metaKey) && event.key === 'k';

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

  protected readonly Display = Display;
}
