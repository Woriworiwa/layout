import { Component, inject, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../core/services/data.service';
import { Tooltip } from 'primeng/tooltip';
import { SplitButton } from 'primeng/splitbutton';
import { MenuItem, MessageService } from 'primeng/api';
import { CanvasService } from '../../canvas/canvas.service';
import { Button } from 'primeng/button';
import { SplitButtonModule } from 'primeng/splitbutton';
import { ThemeConfiguratorComponent } from '../../core/theme/theme-configurator.component';
import { ThemeService } from '../../core/theme/theme.service';
import { Popover } from 'primeng/popover';
import { Dialog } from 'primeng/dialog';
import { RendererComponent } from '../../renderer/renderer.component';
import { BlockUIModule } from 'primeng/blockui';

@Component({
  selector: 'app-header',
  imports: [
    Button,
    FormsModule,
    Tooltip,
    SplitButton,
    SplitButtonModule,
    ThemeConfiguratorComponent,
    Popover,
    Dialog,
    RendererComponent,
    BlockUIModule,
  ],
  templateUrl: `./header.component.html`,
})
export class HeaderComponent {
  private dataService = inject(DataService);
  private canvasService = inject(CanvasService);
  private messageService = inject(MessageService);
  private themeService = inject(ThemeService);

  protected isPreviewVisible = signal<boolean>(false);
  protected readonly window = window;
  protected logoSrc = computed(() =>
    this.themeService.config().darkMode
      ? '../../../assets/logo-dark.svg'
      : '../../../assets/logo.svg',
  );

  items: MenuItem[] = [
    {
      label: 'Empty local storage',
      icon: 'pi pi-trash',
      command: () => {
        this.clearLocalStorage();
      },
    },
  ];

  save() {
    this.dataService.saveDataToLocalStorage();
    this.messageService.add({
      severity: 'info',
      summary: 'Info',
      detail: 'Saved to local storage.',
    });
  }

  clearLocalStorage() {
    this.dataService.clearLocalStorage();
    this.canvasService.setItems(this.dataService.getInitialData());
    this.messageService.add({
      severity: 'info',
      summary: 'Info',
      detail: 'Local storage cleared.',
    });
  }
}
