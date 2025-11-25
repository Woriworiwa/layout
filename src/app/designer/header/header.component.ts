import { Component, inject } from '@angular/core';

import {ThemeService} from "../../core/theme/theme.service";
import {FormsModule} from "@angular/forms";
import {DataService} from "../../core/services/data.service";
import {Tooltip} from "primeng/tooltip";
import {SplitButton} from "primeng/splitbutton";
import {MenuItem, MessageService} from "primeng/api";
import {CanvasService} from "../../shared/canvas/canvas.service";
import {Button} from "primeng/button";
import {AppStateService} from "../../core/services/app-state.service";
import {MainAreaContent} from "../../core/enums";
import {RouterLink, RouterLinkActive} from "@angular/router";
import {Menubar} from "primeng/menubar";
import { SplitButtonModule } from 'primeng/splitbutton';
import { ThemeConfiguratorComponent } from '../../core/theme/theme-configurator.component';
import { Popover } from 'primeng/popover';

@Component({
  selector: 'app-header',
  imports: [
    Button,
    FormsModule,
    Tooltip,
    SplitButton,
    RouterLink,
    RouterLinkActive,
    Menubar,
    SplitButtonModule,
    ThemeConfiguratorComponent,
    Popover,
  ],
  templateUrl: `./header.component.html`,
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  private themeService = inject(ThemeService);
  protected appStateService = inject(AppStateService);
  private dataService = inject(DataService);
  private canvasService = inject(CanvasService);
  private messageService = inject(MessageService);

  protected readonly window = window;

  selectedTabId = MainAreaContent.CANVAS;

  items: MenuItem[] = [
    {
      label: 'Empty local storage',
      icon: 'pi pi-trash',
      command: () => {
        this.clearLocalStorage();
      },
    },
  ];

  tabs: {
    routerLink: string;
    label: string;
    id: MainAreaContent;
  }[] = [
    { label: 'design', id: MainAreaContent.CANVAS, routerLink: '/design' },
    { label: 'preview', id: MainAreaContent.PREVIEW, routerLink: '/preview' },
  ];

  scopedTokens = {
    borderColor: 'transparent',
  };

  showConfig() {
    this.themeService.showConfig();
  }

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

  setSelectedTab(mainAreaContent: MainAreaContent) {
    this.appStateService.setAppLayout({ mainAreaContent: mainAreaContent });
    this.selectedTabId = mainAreaContent;
  }
}
