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
import { CanvasService, SelectionService } from '@layout/canvas';
import { CanvasItemType, Display } from '@layout/models';
import {
  SizingSpacingComponent,
  LayoutComponent,
  MetaDataComponent,
  PropertiesFlexboxGridComponent,
  PropertiesConfig,
  PropertiesService,
} from '@layout/properties';
import {
  CssViewerComponent,
  THEME_CONFIG,
  LOCAL_STORAGE_SERVICE,
} from '@layout/shared';
import { ThemeService } from '../core/theme/theme.service';
import { LocalStorageService } from '../core/services/local-storage.service';

@Component({
  selector: 'app-properties-panel',
  imports: [
    FormsModule,
    ButtonDirective,
    InputGroup,
    InputText,
    SizingSpacingComponent,
    LayoutComponent,
    MetaDataComponent,
    PropertiesFlexboxGridComponent
  ],
  providers: [
    PropertiesService,
    {
      provide: THEME_CONFIG,
      useFactory: () => {
        const themeService = inject(ThemeService);
        return themeService.config();
      },
    },
    {
      provide: LOCAL_STORAGE_SERVICE,
      useExisting: LocalStorageService,
    },
  ],
  templateUrl: './properties-panel.component.html',
  styleUrls: ['./properties-panel.component.scss'],
  host: {
    class: 'min-h-0',
  },
})
export class PropertiesPanelComponent {
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
